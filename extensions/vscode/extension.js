const vscode = require('vscode');
const https = require('https');
const http = require('http');
const { URL } = require('url');

let audioProcess = null;
let isPaused = false;
let statusBarItem = null;

function activate(context) {
  console.log('Varterm TTS extension activated');

  // Create status bar item
  statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
  statusBarItem.command = 'varterm.stop';
  context.subscriptions.push(statusBarItem);

  // Register commands
  context.subscriptions.push(
    vscode.commands.registerCommand('varterm.readSelection', readSelection),
    vscode.commands.registerCommand('varterm.readLine', readCurrentLine),
    vscode.commands.registerCommand('varterm.readDocument', readDocument),
    vscode.commands.registerCommand('varterm.readErrors', readErrors),
    vscode.commands.registerCommand('varterm.stop', stopSpeaking),
    vscode.commands.registerCommand('varterm.pause', togglePause)
  );

  // Auto-read errors if enabled
  const config = vscode.workspace.getConfiguration('varterm');
  if (config.get('autoReadErrors')) {
    context.subscriptions.push(
      vscode.languages.onDidChangeDiagnostics(onDiagnosticsChange)
    );
  }

  updateStatusBar('ready');
}

function deactivate() {
  stopSpeaking();
  if (statusBarItem) {
    statusBarItem.dispose();
  }
}

function getConfig() {
  const config = vscode.workspace.getConfiguration('varterm');
  return {
    voiceTier: config.get('voiceTier', 'cloud'),
    voice: config.get('voice', 'en-US-AriaNeural'),
    rate: config.get('rate', 1.0),
    apiEndpoint: config.get('apiEndpoint', 'https://varterm.com'),
    stripMarkdown: config.get('stripMarkdown', true),
  };
}

function updateStatusBar(status, text = '') {
  if (!statusBarItem) return;
  
  switch (status) {
    case 'speaking':
      statusBarItem.text = '$(unmute) Varterm: Speaking...';
      statusBarItem.tooltip = 'Click to stop';
      statusBarItem.show();
      break;
    case 'paused':
      statusBarItem.text = '$(debug-pause) Varterm: Paused';
      statusBarItem.tooltip = 'Click to stop';
      statusBarItem.show();
      break;
    case 'loading':
      statusBarItem.text = '$(loading~spin) Varterm: Generating...';
      statusBarItem.tooltip = text || 'Generating audio...';
      statusBarItem.show();
      break;
    case 'error':
      statusBarItem.text = '$(error) Varterm: Error';
      statusBarItem.tooltip = text || 'An error occurred';
      statusBarItem.show();
      setTimeout(() => updateStatusBar('ready'), 3000);
      break;
    default:
      statusBarItem.hide();
  }
}

function sanitizeMarkdown(text) {
  const config = getConfig();
  if (!config.stripMarkdown) return text;

  let result = text;
  result = result.replace(/```[\s\S]*?```/g, ' code block ');
  result = result.replace(/`([^`]+)`/g, '$1');
  result = result.replace(/^#{1,6}\s+/gm, '');
  result = result.replace(/\*\*([^*]+)\*\*/g, '$1');
  result = result.replace(/\*([^*]+)\*/g, '$1');
  result = result.replace(/__([^_]+)__/g, '$1');
  result = result.replace(/_([^_]+)_/g, '$1');
  result = result.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
  result = result.replace(/^\s*[-*+]\s+/gm, '');
  result = result.replace(/^\s*\d+\.\s+/gm, '');
  result = result.replace(/^\s*>\s+/gm, '');
  result = result.replace(/^---+$/gm, '');
  result = result.replace(/\n{3,}/g, '\n\n');
  
  return result.trim();
}

async function speakText(text) {
  if (!text || !text.trim()) {
    vscode.window.showWarningMessage('No text to read');
    return;
  }

  stopSpeaking();
  
  const config = getConfig();
  const sanitizedText = sanitizeMarkdown(text);
  
  updateStatusBar('loading');

  try {
    if (config.voiceTier === 'browser') {
      await speakWithBrowser(sanitizedText, config);
    } else {
      await speakWithCloud(sanitizedText, config);
    }
  } catch (error) {
    console.error('TTS Error:', error);
    updateStatusBar('error', error.message);
    vscode.window.showErrorMessage(`Varterm TTS: ${error.message}`);
  }
}

async function speakWithBrowser(text, config) {
  // Use say command on macOS, espeak on Linux, or PowerShell on Windows
  const { exec } = require('child_process');
  const platform = process.platform;
  
  updateStatusBar('speaking');
  
  return new Promise((resolve, reject) => {
    let command;
    const escapedText = text.replace(/"/g, '\\"').replace(/'/g, "\\'");
    
    if (platform === 'darwin') {
      const rate = Math.round(config.rate * 175);
      command = `say -r ${rate} "${escapedText}"`;
    } else if (platform === 'linux') {
      const rate = Math.round(config.rate * 175);
      command = `espeak -s ${rate} "${escapedText}"`;
    } else if (platform === 'win32') {
      command = `powershell -Command "Add-Type -AssemblyName System.Speech; $synth = New-Object System.Speech.Synthesis.SpeechSynthesizer; $synth.Rate = ${Math.round((config.rate - 1) * 10)}; $synth.Speak('${escapedText.replace(/'/g, "''")}')"`;
    } else {
      reject(new Error('Unsupported platform for browser TTS'));
      return;
    }
    
    audioProcess = exec(command, (error) => {
      audioProcess = null;
      updateStatusBar('ready');
      if (error && error.killed !== true) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
}

async function speakWithCloud(text, config) {
  const endpoint = new URL('/api/edge-tts', config.apiEndpoint);
  
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      text: text,
      voice: config.voice,
      rate: config.rate,
    });
    
    const protocol = endpoint.protocol === 'https:' ? https : http;
    
    const req = protocol.request(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
      },
    }, (res) => {
      if (res.statusCode !== 200) {
        let body = '';
        res.on('data', chunk => body += chunk);
        res.on('end', () => {
          try {
            const error = JSON.parse(body);
            reject(new Error(error.error || 'API request failed'));
          } catch {
            reject(new Error(`API returned status ${res.statusCode}`));
          }
        });
        return;
      }
      
      // Save audio to temp file and play
      const os = require('os');
      const fs = require('fs');
      const path = require('path');
      const { exec } = require('child_process');
      
      const tempFile = path.join(os.tmpdir(), `varterm-${Date.now()}.mp3`);
      const writeStream = fs.createWriteStream(tempFile);
      
      res.pipe(writeStream);
      
      writeStream.on('finish', () => {
        updateStatusBar('speaking');
        
        let playCommand;
        if (process.platform === 'darwin') {
          playCommand = `afplay "${tempFile}"`;
        } else if (process.platform === 'linux') {
          playCommand = `mpv --no-video "${tempFile}" || ffplay -nodisp -autoexit "${tempFile}" || aplay "${tempFile}"`;
        } else if (process.platform === 'win32') {
          playCommand = `powershell -Command "(New-Object Media.SoundPlayer '${tempFile}').PlaySync()"`;
        }
        
        audioProcess = exec(playCommand, (error) => {
          // Clean up temp file
          fs.unlink(tempFile, () => {});
          audioProcess = null;
          updateStatusBar('ready');
          
          if (error && error.killed !== true) {
            reject(error);
          } else {
            resolve();
          }
        });
      });
      
      writeStream.on('error', reject);
    });
    
    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

function stopSpeaking() {
  if (audioProcess) {
    audioProcess.kill();
    audioProcess = null;
  }
  isPaused = false;
  updateStatusBar('ready');
}

function togglePause() {
  if (!audioProcess) return;
  
  if (isPaused) {
    audioProcess.kill('SIGCONT');
    isPaused = false;
    updateStatusBar('speaking');
  } else {
    audioProcess.kill('SIGSTOP');
    isPaused = true;
    updateStatusBar('paused');
  }
}

async function readSelection() {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    vscode.window.showWarningMessage('No active editor');
    return;
  }
  
  const selection = editor.selection;
  const text = editor.document.getText(selection);
  
  if (!text) {
    vscode.window.showWarningMessage('No text selected');
    return;
  }
  
  await speakText(text);
}

async function readCurrentLine() {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    vscode.window.showWarningMessage('No active editor');
    return;
  }
  
  const line = editor.document.lineAt(editor.selection.active.line);
  await speakText(line.text);
}

async function readDocument() {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    vscode.window.showWarningMessage('No active editor');
    return;
  }
  
  const text = editor.document.getText();
  
  if (text.length > 50000) {
    const result = await vscode.window.showWarningMessage(
      `Document is ${text.length.toLocaleString()} characters. This may take a while. Continue?`,
      'Yes', 'No'
    );
    if (result !== 'Yes') return;
  }
  
  await speakText(text);
}

async function readErrors() {
  const editor = vscode.window.activeTextEditor;
  const diagnostics = editor 
    ? vscode.languages.getDiagnostics(editor.document.uri)
    : getAllDiagnostics();
  
  if (diagnostics.length === 0) {
    vscode.window.showInformationMessage('No errors or warnings found');
    return;
  }
  
  const errorText = diagnostics.map((d, i) => {
    const severity = d.severity === vscode.DiagnosticSeverity.Error ? 'Error' : 'Warning';
    const line = d.range.start.line + 1;
    return `${severity} on line ${line}: ${d.message}`;
  }).join('. ');
  
  await speakText(`Found ${diagnostics.length} issues. ${errorText}`);
}

function getAllDiagnostics() {
  const allDiagnostics = [];
  vscode.languages.getDiagnostics().forEach(([uri, diagnostics]) => {
    allDiagnostics.push(...diagnostics);
  });
  return allDiagnostics;
}

let lastDiagnosticCount = 0;
function onDiagnosticsChange(event) {
  const editor = vscode.window.activeTextEditor;
  if (!editor) return;
  
  const diagnostics = vscode.languages.getDiagnostics(editor.document.uri);
  const errorCount = diagnostics.filter(d => d.severity === vscode.DiagnosticSeverity.Error).length;
  
  if (errorCount > lastDiagnosticCount) {
    const newErrors = diagnostics
      .filter(d => d.severity === vscode.DiagnosticSeverity.Error)
      .slice(lastDiagnosticCount);
    
    if (newErrors.length > 0) {
      const errorText = newErrors.map(d => d.message).join('. ');
      speakText(`New error: ${errorText}`);
    }
  }
  
  lastDiagnosticCount = errorCount;
}

module.exports = {
  activate,
  deactivate
};

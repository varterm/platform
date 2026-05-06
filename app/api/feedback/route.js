import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const FEEDBACK_DIR = process.env.FEEDBACK_DIR || '/tmp/varterm-feedback';

export async function POST(request) {
  try {
    const { type, message, email } = await request.json();
    
    if (!message || !message.trim()) {
      return NextResponse.json(
        { success: false, error: 'Message is required' },
        { status: 400 }
      );
    }
    
    const feedback = {
      id: `fb_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: type || 'general',
      message: message.trim(),
      email: email?.trim() || null,
      userAgent: request.headers.get('user-agent'),
      timestamp: new Date().toISOString(),
    };
    
    // Ensure feedback directory exists
    await fs.mkdir(FEEDBACK_DIR, { recursive: true });
    
    // Write feedback to file
    const filename = `${feedback.id}.json`;
    await fs.writeFile(
      path.join(FEEDBACK_DIR, filename),
      JSON.stringify(feedback, null, 2)
    );
    
    console.log('Feedback received:', feedback.id, feedback.type);
    
    return NextResponse.json({ success: true, id: feedback.id });
    
  } catch (error) {
    console.error('Feedback error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save feedback' },
      { status: 500 }
    );
  }
}

export async function GET() {
  // Simple endpoint to list feedback (for admin use)
  const token = process.env.VARTERM_ADMIN_TOKEN;
  
  if (!token) {
    return NextResponse.json(
      { success: false, error: 'Admin access not configured' },
      { status: 403 }
    );
  }
  
  try {
    await fs.mkdir(FEEDBACK_DIR, { recursive: true });
    const files = await fs.readdir(FEEDBACK_DIR);
    const feedbacks = [];
    
    for (const file of files.filter(f => f.endsWith('.json'))) {
      const content = await fs.readFile(path.join(FEEDBACK_DIR, file), 'utf-8');
      feedbacks.push(JSON.parse(content));
    }
    
    feedbacks.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    return NextResponse.json({ success: true, feedbacks });
  } catch (error) {
    console.error('Feedback list error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to list feedback' },
      { status: 500 }
    );
  }
}

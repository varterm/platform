# editor-reread-last-agent-reply — complete

Date: 2026-09-16
Owner: cntrlne

## What shipped

Re-reading the last agent reply is now a one-key action instead of a copy-and-paste
dance that did not work.

- `Varterm: Read Last Agent Reply` got a keybinding (`⌘⇧⌥A` / `Ctrl+Shift+Alt+A`) and
  a status bar button (`$(comment-discussion)`, priority 82, between Auto-read and
  the selection/clipboard button). The command already existed but was palette-only,
  which is why it was never found.
- The button hides when there is nothing this window could replay, so it never sits
  there rejecting clicks. It counts audio already loaded in this window as well as a
  captured reply on disk, because the command can replay either.
- Replay is now scoped to the window you are in. `readLastAgentText()` applies the
  existing `windowOwnsDrop()` check, which it previously ignored.
- Each window keeps its own last reply. Scoping alone was not enough: the hook
  wrote to one file shared by the whole machine, so a window lost its reply as
  soon as any other window got an answer, and with eight windows open the button
  was almost always missing. The hook now also writes a copy per project under
  `~/.cursor/varterm-agent-replies/`, pruned after thirty days, and each window
  reads back the newest copy that belongs to it. The shared file is still
  consulted as a fallback so replies captured before this change stay
  replayable, and auto-read's cross-window claiming is untouched.
- The failure message distinguishes "nothing captured yet" from "captured, but it
  belongs to another window", which are different problems with different fixes.

### Why the clipboard route failed

The status bar clipboard button routes through `freshClipboardText()`, which returns
nothing when the clipboard matches what it last read:

```ts
if (text && text !== clipboardSnapshot) { clipboardSnapshot = text; return text.trim(); }
return '';
```

Re-reading is by definition a repeat, so it was the one case the guard rejected.
`snapshotClipboard()` also runs at activation, so a reply already on the clipboard
when the window opened failed on the very first press. The guard was left in place —
it stops a failed highlight-copy from silently reading stale clipboard — and the
agent reply got its own affordance instead. `Varterm: Read Clipboard Aloud`
(`⌘⇧⌥L`) does not use the guard and will re-read the same clipboard indefinitely.

### Why window scoping

Every Cursor window writes to one shared `~/.cursor/varterm-last-agent.json`, so the
newest reply was usually some other project's. Verified against the live file: it
held a reply from `/Users/jc_io/src/casbu`, which a varterm window would previously
have read aloud.

## How to verify

- `npm test` in `extensions/vscode` — 10 new assertions in `tests/agent-drop.test.mjs`
  cover the matching logic, including the sibling-prefix case (`/src/varterm` must not
  claim `/src/varterm-plat`), multi-root windows, folderless windows, drops with no
  recorded origin, and Windows separators.
- In a window with Auto-read on, wait for a reply, then press `⌘⇧⌥A` or the speech
  bubble. It replays without re-synthesising.
- In a second window on a different project, the same press reports that the reply
  belongs to another window rather than reading it.

## Follow-ups

- Capture is still gated on Auto-read: `scripts/varterm-autoread.py` only writes the
  drop file when the global `enabled` flag is true, so with Auto-read off there is
  nothing to re-read. Writing it always, and gating only playback, would make this
  work regardless — at the cost of persisting replies locally when the user has
  opted out of hearing them. Not taken without a decision.
- A window with no folder open owns nothing, so the button never appears there. Correct
  under strict scoping, but worth revisiting if it surprises anyone.
- The per-project copies only appear as each project receives its next reply after
  the updated hook is deployed, which happens on extension activation. Until then
  the shared-file fallback applies and only the most recent project has a button.
- Shipping in 0.1.65.

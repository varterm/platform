# editor-shared-listen-queue — complete

Date: 2026-09-17
Owner: cntrlne

## What shipped

Every Cursor window now feeds one reading queue instead of keeping its own, so
replies are read in the order they arrived rather than the order windows noticed
the speaker was free. Whichever window is idle reads the next item, and the queue
picker shows which project each one came from.

The status bar mark gained a third state to go with it. Green and moving means
the reading is happening in this window; amber means this window has a reply
waiting, with its place in the line on hover; a dim static mark means another
window is talking. Before this a window waiting its turn looked identical to one
that merely had a neighbour speaking.

Three defects came out of looking at this, all of them older than the change:

- **Queued replies could wait indefinitely.** Every path that moved the queue
  along hung off a window finishing its own playback. A window that queued while
  another was speaking had nothing of its own to finish, so it was never told the
  speaker had freed up. The 5s lock poll did not help: it landed in a handler that
  only refreshed the status bar. Releasing the speaker now nudges the others.
- **Two windows could start reading at once.** The playback lock is only written
  once audio begins, so the whole synthesis step looks idle to everyone else.
  Taking an item from the shared queue now claims the queue in the same locked
  write, which is what makes one reader at a time true rather than likely.
- **A window bailing out of the advance loop kept the claim.** Left alone that
  blocked every other window until the 15 minute expiry, so going idle with
  nothing to read hands the queue back.

Settings, both new:

- `vartermCursor.sharedListenQueue` (default `true`) — off keeps a window's
  queue to itself.
- `vartermCursor.queueItemExpiryMinutes` (default `10`, `0` never expires).

## Design notes

Audio never goes in the shared file. `AudioTrack` holds base64 in memory and
resume items carry a pause offset that only means something in the window that
paused, so the shared queue carries text and the window that takes an item
synthesises it. Resume items stay local and are read first, so an interrupted
window finishes its own thought before picking up someone else's.

The queue clears on restart without any window tidying up on the way out: items
record the window that queued them, and the queue is discarded once none of those
windows are alive. Liveness is judged across the whole queue rather than item by
item on purpose — closing one project window should not silently discard what it
queued while other windows are still there to read it.

State lives in `~/.cursor/varterm-listen-queue.json`, guarded by a `wx` lock file
alongside it, the same pattern auto-read already uses for claiming replies.

## How to verify

- `npm test` in `extensions/vscode` — 16 assertions in `tests/listen-queue.test.mjs`
  cover expiry, the abandoned-session rule, the claim, and real cross-process
  contention using child processes with `HOME` pointed at a temp directory.
- The contention tests are checked against their own absence: stubbing
  `withQueueLock` out to call straight through makes the two push tests fail, so
  they are testing the locking rather than passing regardless.
- By hand, with two windows: queue a reply in each while a third is speaking and
  confirm they are read in arrival order, that the badge counts both, and that the
  queue picker attributes each to its project.

## Follow-ups

- The playback lock itself is still a last-writer-wins write, not an atomic
  claim. Queue-driven reads are now serialised by the queue claim, but two
  windows racing on a manual Play press are still resolved by the steal
  semantics rather than by a lock.
- Pressing Stop during a queued read lets the next item start. That predates
  this change, and it is arguably wrong — Stop probably means stop.

# HackerWare - Cybersecurity Micro-Games for Kids

## Original Problem Statement
Create a fast-paced, educational WarioWare-style web micro-game titled "HackerWare", designed for children aged 6 to 12 to learn about cybersecurity. Vibrant pixel-art aesthetic. 100% mouse controls. Procedural Web Audio API sound effects (no external audio files). 5 mini-games covering: Security & Privacy, Digital Well-being, Media Literacy, Digital Risks, and Phishing Awareness. Each mini-game has a 5-7s timer (user expanded to 15→10s curve), 3 lives, intro screen, feedback screen with cyber tip, Game Over → Play Again loop.

## User Choices
- **Implementation**: Single self-contained HTML file (HTML + CSS + JS, no external deps except Google "Press Start 2P" pixel font)
- **Visual style**: Vibrant arcade-neon palette (chosen by agent: hot pink #ff2975, cyan #00f0ff, electric yellow #f7ff00, lime green #39ff14, red #ff124f on deep purple #0d0221)
- **Mini-game order**: Randomized each round
- **Difficulty curve**: Timer starts at 15s, decreases by 1s per won round, floors at 10s
- **Score**: Lives only (3 pixel hearts), no score counter

## Architecture
- `/app/frontend/public/hackerware.html` — the single self-contained game (1600+ lines, ~52 KB)
- `/app/hackerware.html` — portable duplicate for sharing/download
- `/app/frontend/src/App.js` — minimal React shell that redirects root URL → `/hackerware.html`

### JS Module Layout (inside the single HTML)
1. `SoundSynth` — procedural Web Audio API synthesizer (playWinSound, playLoseSound, playTickSound, playClickSound, playGameOverSound + helper FX: playSnap, playDeflect, playSnip, playCrumple)
2. `Game` state object — lives, roundsWon, currentTimerSec, miniGameQueue, activeMiniGame, acceptInput
3. `Screens` manager — show(id), hud(visible)
4. `Timer` — start(seconds, onExpire), stop, tick sound each whole second
5. `MiniGames` registry — 5 mini-games each with { name, topic, prompt, tipWin, tipLose, mount(area, onWin, onLose), cleanup() }
6. Game flow controller — startNewGame, nextRound, showIntro (2s), startMiniGame, showFeedback, gameOver
7. Helpers — makeDraggable, localRect, overlaps, distance, spawnBurst, shuffle
8. Dev hooks on window (SoundSynth, Game, MiniGames, Screens, Timer, renderLives, startNewGame, nextRound) for testability

### 5 Mini-Games (Randomized)
| # | Name | Theme | Win Condition |
|---|------|-------|---------------|
| 0 | Password Puzzle | Security & Privacy | Drag A / 7 / @ / k pieces into 4 slots (70px snap threshold) |
| 1 | Meme Shield | Digital Well-being | Click only red "mean" bubbles; let green bubbles pass |
| 2 | Fake News Detective | Media Literacy | Drag the suspicious phone alert into the recycle bin |
| 3 | Inbox Cleaner | Digital Risks | Drag virus emails → trash, safe emails → inbox (3+ correct, 0 viruses in inbox) |
| 4 | Phishing Hook Cut | Phishing Awareness | Cursor = scissors; click the cyan dangling line to cut it (clicking the bait button = lose) |

## What's Been Implemented (Jan 21, 2026)
- ✅ Start screen with HACKERWARE pixel title, 3 hearts preview, PLAY button, cyber-hero hint
- ✅ HUD: 3 pixel hearts, gradient TIME bar, ROUND counter
- ✅ 2-second intro screen with mini-game prompt + topic before each game
- ✅ Procedural Web Audio API synthesizer with all 5 required sound functions + per-game effects
- ✅ Tick sound on every remaining second of the timer
- ✅ All 5 mini-games fully functional and winnable end-to-end (verified by automated testing)
- ✅ Drag-and-drop with snap-to-target collision detection
- ✅ Custom cursors for Meme Shield (pixel shield) and Phishing (pixel scissors)
- ✅ Feedback screen with WIN/LOSE result + cyber-safety tip after every round
- ✅ Game Over screen with rounds-survived count + PLAY AGAIN button
- ✅ Difficulty curve 15→10s per won round
- ✅ Randomized mini-game queue each game start
- ✅ Stage scaling to fit any viewport (virtual 960×600)
- ✅ Animated scrolling pixel-grid background, neon glow shadows, blink/shake/bounce animations
- ✅ Comprehensive data-testid coverage for all interactive elements
- ✅ Dev hooks exposed on window for external testing/embedding
- ✅ 100% mouse controls (also supports touch via touchstart/touchmove/touchend)
- ✅ 0 JS console errors verified by testing subagent
- ✅ Self-contained — no external deps except Google Font (Press Start 2P + VT323)

## What's Been Implemented (Jan 22, 2026) - Bilingual + UX Iteration
- ✅ **Bilingual EN/ES**: Mandatory language selector on start screen (ENGLISH / ESPAÑOL buttons with active-state highlight). Selecting a language synchronously translates ALL UI: subtitle, hint, HUD (TIEMPO/RONDA), every mini-game prompt + topic + in-game labels (instructions, button text, email senders, fake-news copy, bait text), every cyber tip, feedback labels (¡GANASTE!/¡OH NO!/CIBER-CONSEJO/SIGUIENTE), Game Over screen, PLAY/JUGAR & PLAY AGAIN/JUGAR DE NUEVO buttons.
- ✅ **I18N system**: `I18N` dictionary with `en`/`es` keys; `t(keyOrObj, ...args)` helper resolves I18N keys, `{en,es}` objects, and function values (e.g., `survived(n)`); `applyLanguage()` walks every `data-i18n` element and refreshes text; dev hooks exposed on window.
- ✅ **Manual tip dismissal**: Feedback overlay NO LONGER auto-advances. The setTimeout(advance, 3200) was removed. A dedicated `NEXT / SIGUIENTE` pixel button (data-testid=next-button) is the ONLY way to advance — verified by testing subagent that screen stays visible for 6+ seconds without click.
- ✅ **Timer paused during tip overlay**: `Timer.stop()` clears the interval before `showFeedback()` runs. `Game.timerInterval === null` while feedback is shown (verified). New timer starts only on `startMiniGame()` after NEXT click.
- ✅ **Fake News Detective redesigned**: 
   - Random selection from a 7-item pool with `fake: true|false` flags
   - Two drop zones rendered: `recycle-bin` (red, BASURA/TRASH) for FAKE alerts + `verified-folder` (green ✅, VERIFICADO/VERIFIED) for TRUE alerts
   - Visual differentiation: fake alerts use orange/red pulsing style; true alerts use solid cyan
   - All 4 routes work: fake→trash=WIN, fake→verified=LOSE, true→verified=WIN, true→trash=LOSE
   - Sample content includes both new TRUE alerts (homework deadlines, field trip forms) and FAKE alerts (school-closed forever, free iPhones, ghost-hacking-wifi) in both EN and ES

## What's Been Implemented (Jan 22, 2026) - 6 New Mini-Games (3 per category)
- ✅ **App Permissions (Privacy)**: retro system-style popup; an innocent app (Flashlight, Calculator, Alarm Clock, etc.) requests a suspicious permission (Contacts, GPS, SMS). Win = DENY, Lose = ALLOW. 8 EN/ES trap combos.
- ✅ **Think Before You Post (Citizenship)**: chat composer with a draft message; some have private info (address, school, phone), others are safe. Win = pick THINK for unsafe, POST for safe. 10 EN/ES posts.
- ✅ **URL Detective (Dangers)**: shows 4 URLs — 1 real + 3 typosquatted fakes (g00gle.com, googel.com, etc.). Click the real one to win, any fake = lose. 6 site pools (YouTube, Google, Amazon, Netflix, Wikipedia, Spotify).
- ✅ **Download Warning (Dangers)**: orange-titlebar dialog showing a shady download (free_robux_GENERATOR.exe, family_photo.jpg.exe, etc.). Always pick CANCEL to win. 7 EN/ES trap files.
- ✅ **Screen Lock (Privacy)**: drag-and-drop a padlock onto the unlocked phone before the "snoop emoji" walks across (12s anim). Snap detection via overlaps(). Loses if snoop reaches the phone.
- ✅ **2FA Quiz (Privacy)**: random 4-digit code shown in a notification card; 4 input slots + pixel numeric keypad. Type each digit correctly to win; wrong digit = lose.
- ✅ **Cookies Banner (Privacy)**: faux browser window with cookie banner sliding up from the bottom. Win = ONLY NECESSARY, Lose = ACCEPT ALL. 5 EN/ES fake site domains for flavor.

### Category Distribution (now 12 mini-games total)
- 🟪 **Citizenship (3)**: fake-news, meme-shield, think-before-post
- 🟥 **Dangers (4)**: phishing-hook, inbox-cleaner, url-detective, download-warning
- 🟩 **Privacy (5)**: password-puzzle, app-permissions, screen-lock, tfa-quiz, cookies-banner

## Backlog / Future Enhancements (P2)
- Differentiate `tipWin` vs `tipLose` text per mini-game for stronger learning reinforcement on losses
- Refactor `localRect()` and `spawnBurst()` to accept area element as parameter (more robust than getElementById)
- Add an achievement / streak indicator (mini "perfect run" badge after winning N in a row without losing a life)
- Accessibility pass: keyboard fallbacks, screen-reader announcements
- More content variety per mini-game (additional password templates, more email senders, more fake-news prompts in ES)
- Mid-game language toggle (currently locked after PLAY click; `applyLanguage` would need to re-render HUD round label)

## How to Run
- Live preview: https://syntax-checker-59.preview.emergentagent.com/ (auto-redirects to `/hackerware.html`)
- Standalone: open `/app/hackerware.html` in any modern browser — fully self-contained, just needs internet for Google Fonts (game works without too — falls back to monospace)

## Test Reports
- iteration_1.json — found 2 CRITICAL bugs (Phishing & Meme Shield could not be won due to area.id rename breaking helpers) + 1 MEDIUM (dev hooks not on window)
- iteration_2.json — Phishing fixed; Meme Shield fix accidentally not applied
- iteration_3.json — All bugs fixed. 100% frontend success. 5/5 mini-games winnable. 0 console/page errors.

# Dinosaur Runner Game 🦖

A browser-based endless runner game inspired by Chrome's offline T-Rex game. Control a dinosaur wearing a Vietnam flag T-shirt as you jump and dodge through increasingly difficult obstacles!

## 🎮 How to Play

1. Open `index.html` in a modern web browser
2. Press **SPACE** or **click** to start the game
3. Navigate through obstacles to survive as long as possible
4. Your score increases the longer you survive

## 🕹️ Controls

| Key | Action |
|-----|--------|
| **SPACE** or **UP ARROW** | Jump |
| **LEFT ARROW** | Move backward |
| **RIGHT ARROW** | Move forward |
| **P** | Pause game |
| **ESC** | Resume from pause |
| **R** | Restart (after game over) |
| **Click/Tap** | Start, Jump, or Restart |

### Mobile
- **Tap** anywhere to jump, start, or restart

## ✨ Features

### Gameplay
- **Endless runner** - Survive as long as you can
- **Progressive difficulty** - Speed increases over time
- **Random speed bursts** - Sudden 80% speed increases for 1.5 seconds
- **Unpredictable spacing** - Variable distance between obstacles
- **Voice warnings** - Hear "Ái, chết tui" when obstacles get close!

### Obstacles
| Type | Description |
|------|-------------|
| Small | Easy to jump over |
| Medium | Standard height |
| Large | Requires good timing |
| **Giant** | Extra tall (dark red) - jump early! |
| **Wide** | Extra wide - sustained jump needed |

- Single cacti and **grouped cacti** (2-5 together)
- Giant and wide types appear after 10 seconds

### Visual
- Dinosaur with **Vietnam flag T-shirt** (red with yellow star)
- Running animation with alternating legs
- Animated clouds in the background
- Scrolling ground pattern
- Speed burst indicator (flashing red border)

### Audio
- Vietnamese voice warning when obstacles approach
- Uses Web Speech API (no audio files needed)

### Scoring
- **1 point per 100ms** survived
- **High score** saved in browser (localStorage)
- Score display during gameplay
- Final score shown on game over

## 🛠️ Tech Stack

- **HTML5 Canvas** - Game rendering
- **Vanilla JavaScript** - Game logic
- **CSS3** - Styling and responsiveness
- **Web Speech API** - Voice warnings
- **localStorage** - High score persistence
- **No external dependencies**

## 📁 Project Structure

```
games/
├── index.html          # Main HTML file
├── css/
│   └── style.css       # Game styling
├── js/
│   ├── game.js         # Main game logic (639 lines)
│   ├── player.js       # Dinosaur character (216 lines)
│   ├── obstacle.js     # Cacti obstacles (162 lines)
│   └── utils.js        # Utility functions (39 lines)
├── GAME_PLAN.md        # Development plan
└── README.md           # This file
```

## 🎯 Game Mechanics

### Difficulty Scaling
- Base speed increases every 5 seconds
- Obstacle spawn rate increases with speed
- Special obstacles (giant, wide) appear after 10 seconds
- Random speed bursts keep players alert

### Collision Detection
- AABB (Axis-Aligned Bounding Box) collision
- 8px padding for fairness (slightly forgiving)

### Obstacle Spacing
- 20% chance: Very close (150-250px) - challenging
- 30% chance: Short (250-350px)
- 30% chance: Medium (350-500px)
- 20% chance: Long (500-700px) - breather

## 🌐 Browser Support

Works in all modern browsers:
- ✅ Chrome
- ✅ Firefox
- ✅ Safari
- ✅ Edge

Voice warnings require Web Speech API support (available in most modern browsers).

## 🚀 Quick Start

```bash
# Option 1: Open directly
open index.html

# Option 2: Use a local server (recommended)
python3 -m http.server 8080
# Then visit http://localhost:8080
```

## 🎨 Customization

### Adjust Difficulty
In `js/game.js`:
```javascript
this.speedIncreaseInterval = 5000;  // Speed increase frequency (ms)
this.speedBurstMultiplier = 1.8;    // Speed burst intensity
this.warningDistance = 100;          // Voice warning trigger distance
```

### Change Voice Warning
In `js/game.js`, find `prepareWarningVoice()`:
```javascript
this.warningUtterance = new SpeechSynthesisUtterance('Your text here');
this.warningUtterance.lang = 'vi-VN';  // Language code
```

## 📝 Development

See [GAME_PLAN.md](GAME_PLAN.md) for the complete development plan including:
- Implementation phases
- Technical specifications
- Feature checklist
- Future enhancement ideas

## 🏆 Tips for High Scores

1. **Jump early** for giant (red) cacti
2. **Use horizontal movement** to position yourself
3. **Listen for warnings** - "Ái, chết tui" means danger is close!
4. **Watch for speed bursts** - red flashing border means faster obstacles
5. **Stay calm during groups** - they're tight but passable

---

**Enjoy the game!** 🦖🌵

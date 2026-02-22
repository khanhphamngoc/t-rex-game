# Dinosaur Runner Game - Development Plan

## 🎮 Game Overview

A browser-based endless runner game inspired by Chrome's offline T-Rex game. The player controls a dinosaur wearing a Vietnam flag T-shirt that must navigate through obstacles (cacti) using jump and horizontal movement while the game speed gradually increases with random speed bursts.

## 🛠️ Technology Stack

- **HTML5**: Structure and canvas element
- **CSS3**: Styling and responsive design
- **JavaScript (Vanilla)**: Game logic, physics, and rendering
- **Canvas API**: For drawing game elements
- **Web Speech API**: Voice warnings when obstacles approach
- **localStorage**: High score persistence
- **No external dependencies**: Pure vanilla JavaScript

## 🎯 Core Game Mechanics

### 1. **Player Character (Dinosaur)**
   - Horizontal movement with LEFT/RIGHT arrow keys
   - Jump mechanic: Press SPACEBAR or UP ARROW
   - Gravity physics with smooth landing
   - Running animation (alternating legs)
   - Tucked legs when jumping
   - Vietnam flag T-shirt decoration (red with yellow star)
   - Collision detection with obstacles

### 2. **Obstacles (Cacti)**
   - Five obstacle types: small, medium, large, giant, wide
   - Single cacti and grouped cacti (2-5 together)
   - Random unpredictable spacing between groups
   - Giant cacti (dark red) require early jumps
   - Wide cacti require sustained clearance
   - Move left at variable speed with random speed bursts

### 3. **Ground/Environment**
   - Sky gradient background
   - Animated scrolling clouds
   - Scrolling ground with line pattern
   - Speed-responsive scrolling

### 4. **Game Progression**
   - Score increases over time (1 point per 100ms)
   - Base speed gradually increases every 5 seconds
   - Random speed bursts (80% faster for 1.5 seconds)
   - Special obstacles appear after 10 seconds
   - Game over on collision with restart option

### 5. **Audio System**
   - Voice warning: "Ái, chết tui" when obstacles approach
   - Vietnamese language speech synthesis
   - 2-second cooldown between warnings
   - Triggers at 100px proximity

### 6. **Controls**
   - **SPACEBAR** or **UP ARROW**: Jump
   - **LEFT ARROW**: Move backward
   - **RIGHT ARROW**: Move forward
   - **P**: Pause game
   - **ESC**: Resume from pause
   - **R** or **Click**: Restart after game over
   - **Touch/Tap**: Jump (mobile)

## 📁 Project Structure

```
games/
├── index.html          # Main HTML file with game container
├── css/
│   └── style.css       # Game styling and responsive design
├── js/
│   ├── game.js         # Main game logic, loop, spawning, collision
│   ├── player.js       # Player class with physics and rendering
│   ├── obstacle.js     # Obstacle class with 5 types
│   └── utils.js        # Utility functions (random, clamp, collision)
├── GAME_PLAN.md        # This development plan
└── README.md           # User documentation
```

## 🚀 Implementation Phases

### Phase 1: Setup & Basic Structure ✅
1. Created HTML file with canvas element
2. Set up CSS for full-screen responsive game view
3. Initialized canvas context and 60 FPS game loop
4. Implemented responsive canvas sizing (800x200 aspect ratio)

### Phase 2: Player Implementation ✅
1. Created Player class with position, velocity, and state
2. Implemented jump mechanics with gravity (0.6 acceleration)
3. Added ground collision detection
4. Drew dinosaur with body, head, legs, and eye
5. Added running animation (alternating leg positions)

### Phase 3: Obstacle System ✅
1. Created Obstacle class with multiple types
2. Implemented obstacle spawning with timer
3. Added random obstacle types with weighted probability
4. Implemented obstacle movement synced with game speed
5. Added automatic removal when off-screen

### Phase 4: Collision Detection ✅
1. Implemented AABB collision detection with padding
2. Added collision checking between player and all obstacles
3. Triggers game over state on collision

### Phase 5: Game State Management ✅
1. Implemented states: MENU, PLAYING, GAME_OVER, PAUSED
2. Created start screen with instructions
3. Created game over screen with final score
4. Implemented restart functionality via keyboard and click

### Phase 6: Scoring & Difficulty ✅
1. Implemented time-based score counter
2. Added progressive speed increase
3. Added score display with current and high score
4. Saved high score to localStorage

### Phase 7: Visual Polish ✅
1. Added Vietnam flag T-shirt to dinosaur
2. Added sky gradient and animated clouds
3. Added scrolling ground pattern
4. Added speed burst visual indicator (flashing red border)
5. Improved obstacle visuals with arms and texture

### Phase 8: Testing & Refinement ✅
1. Added mobile touch support
2. Balanced difficulty curve
3. Added voice warning system
4. Added horizontal player movement
5. Added grouped obstacle spawning
6. Added giant and wide obstacle types
7. Added random speed bursts

## ✨ Features List

### Core Features ✅
- [x] Dinosaur character with jump and horizontal movement
- [x] Five obstacle types (small, medium, large, giant, wide)
- [x] Single and grouped obstacle spawning
- [x] AABB collision detection with fairness padding
- [x] Time-based scoring system
- [x] High score persistence (localStorage)
- [x] Game over and restart functionality
- [x] Progressive difficulty scaling
- [x] Keyboard controls (SPACE, UP, LEFT, RIGHT, P, R, ESC)

### Enhanced Features ✅
- [x] Vietnam flag T-shirt on dinosaur
- [x] Running animation (leg alternation)
- [x] Cloud background elements
- [x] Scrolling ground pattern
- [x] Voice warnings ("Ái, chết tui")
- [x] Mobile touch controls
- [x] Pause functionality
- [x] Random speed bursts
- [x] Unpredictable obstacle spacing
- [x] Visual speed burst indicator

## 🎨 Visual Design

### Color Scheme
- **Sky**: Blue gradient (#87CEEB to #E0F6FF)
- **Ground**: Brown (#8B7355)
- **Dinosaur Body**: Dark gray (#333333)
- **T-Shirt**: Vietnam red (#DA251D) with yellow star (#FFFF00)
- **Normal Cacti**: Dark green (#2D5016)
- **Giant Cacti**: Dark red (#8B0000) - warning color
- **Wide Cacti**: Light green (#4A6B2A)

### Canvas Dimensions
- Default: 800x200 pixels
- Responsive: Scales to fit viewport maintaining 4:1 aspect ratio

## 🔧 Technical Details

### Game Loop
- **RequestAnimationFrame**: Smooth 60 FPS rendering
- **Delta time**: Frame-rate independent physics
- **Update cycle**: Input → Physics → Collision → Spawn → Render

### Physics
- **Gravity**: 0.6 pixels/frame²
- **Jump velocity**: -15 pixels/frame (upward)
- **Horizontal speed**: 8 pixels/frame
- **Ground level**: 75% of canvas height

### Obstacle Types
| Type | Width | Height | Color | Spawn Time |
|------|-------|--------|-------|------------|
| small | 16px | 24px | Green | Immediate |
| medium | 20px | 36px | Green | Immediate |
| large | 24px | 50px | Green | Immediate |
| giant | 28px | 70px | Dark Red | After 10s |
| wide | 50px | 40px | Light Green | After 10s |

### Spacing System
| Chance | Distance | Purpose |
|--------|----------|---------|
| 20% | 150-250px | Challenge |
| 30% | 250-350px | Normal short |
| 30% | 350-500px | Normal medium |
| 20% | 500-700px | Breather |

### Speed Burst System
- **Trigger chance**: 3% per frame after 5 seconds
- **Duration**: 1.5 seconds
- **Multiplier**: 1.8x base speed
- **Cooldown**: 4 seconds between bursts

### Voice Warning System
- **Phrase**: "Ái, chết tui" (Vietnamese)
- **Trigger distance**: 100 pixels
- **Cooldown**: 2 seconds
- **API**: Web Speech Synthesis

## 📋 Development Checklist

- [x] Project structure setup
- [x] HTML/CSS foundation
- [x] Canvas initialization
- [x] Game loop implementation
- [x] Player class with physics
- [x] Jump mechanics
- [x] Horizontal movement (LEFT/RIGHT)
- [x] Vietnam flag T-shirt decoration
- [x] Running animation
- [x] Obstacle class with 5 types
- [x] Single obstacle spawning
- [x] Grouped obstacle spawning (2-5)
- [x] Random spacing system
- [x] Collision detection
- [x] Game state management
- [x] Pause functionality
- [x] Score system
- [x] High score persistence
- [x] Progressive difficulty
- [x] Speed burst system
- [x] Voice warning system
- [x] Cloud animations
- [x] Ground scrolling
- [x] Mobile touch support
- [x] Visual polish
- [x] Documentation

## 🎯 Success Criteria

1. ✅ Game is playable and challenging
2. ✅ Smooth 60 FPS gameplay
3. ✅ Responsive controls (keyboard + touch)
4. ✅ Clear visual feedback (speed bursts, warnings)
5. ✅ Unpredictable difficulty keeps players engaged
6. ✅ Works in all modern browsers
7. ✅ Clean, modular code structure

## 📝 Future Enhancements (Ideas)

- Duck mechanic (DOWN arrow)
- Day/night cycle
- Flying obstacles (birds)
- Power-ups (invincibility, slow-mo)
- Multiple dinosaur skins
- Background music
- Particle effects on collision
- Leaderboard system
- Achievements/milestones

---

**Status: COMPLETED** 🎉

All planned features have been implemented. The game is fully playable with progressive difficulty, voice warnings, and Vietnamese cultural elements.

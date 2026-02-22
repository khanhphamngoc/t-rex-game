# Chrome Dinosaur Game - Development Plan

## 🎮 Game Overview

A simple, browser-based endless runner game inspired by Chrome's offline T-Rex game. The player controls a dinosaur that must jump over obstacles (cacti) while the game speed gradually increases.

## 🛠️ Technology Stack

- **HTML5**: Structure and canvas element
- **CSS3**: Styling and animations
- **JavaScript (Vanilla)**: Game logic, physics, and rendering
- **Canvas API**: For drawing game elements
- **No external dependencies**: Pure vanilla JavaScript for simplicity

## 🎯 Core Game Mechanics

### 1. **Player Character (Dinosaur)**
   - Stationary horizontal position (left side of screen)
   - Jump mechanic: Press SPACEBAR or UP ARROW
   - Gravity physics: Falls down after jump
   - Animation states: Running, jumping, ducking (optional)
   - Collision detection with obstacles

### 2. **Obstacles (Cacti)**
   - Multiple cactus types (small, medium, large)
   - Spawn from right side of screen
   - Move left at increasing speed
   - Random spacing between obstacles
   - Despawn when off-screen

### 3. **Ground/Environment**
   - Scrolling ground texture/pattern
   - Continuous horizontal movement
   - Matches obstacle speed

### 4. **Game Progression**
   - Score increases over time
   - Speed gradually increases (difficulty scaling)
   - Game over on collision
   - Restart functionality

### 5. **Controls**
   - **SPACEBAR** or **UP ARROW**: Jump
   - **DOWN ARROW** (optional): Duck (if implemented)
   - **R** or **Click**: Restart after game over

## 📁 Project Structure

```
games/
├── index.html          # Main HTML file
├── css/
│   └── style.css      # Game styling
├── js/
│   ├── game.js        # Main game logic
│   ├── player.js      # Player/dinosaur class
│   ├── obstacle.js    # Obstacle class
│   └── utils.js       # Utility functions
├── assets/            # (Optional) Images/sprites
│   └── sprites/       # If using image assets
└── README.md          # Project documentation
```

## 🚀 Implementation Steps

### Phase 1: Setup & Basic Structure
1. Create HTML file with canvas element
2. Set up CSS for full-screen game view
3. Initialize canvas context and basic game loop
4. Create responsive canvas sizing

### Phase 2: Player Implementation
1. Create Player class with position, velocity, and state
2. Implement jump mechanics with gravity
3. Add ground collision detection
4. Draw dinosaur (simple rectangle/shape initially)
5. Add running animation (optional sprite animation)

### Phase 3: Obstacle System
1. Create Obstacle class
2. Implement obstacle spawning system
3. Add random obstacle types and spacing
4. Implement obstacle movement
5. Add obstacle removal when off-screen

### Phase 4: Collision Detection
1. Implement rectangle-based collision detection
2. Check collision between player and obstacles
3. Trigger game over state on collision

### Phase 5: Game State Management
1. Implement game states: MENU, PLAYING, GAME_OVER
2. Add start screen
3. Add game over screen with score
4. Implement restart functionality

### Phase 6: Scoring & Difficulty
1. Implement score counter (time-based or distance-based)
2. Add speed increase over time
3. Display score on screen
4. Save high score (localStorage)

### Phase 7: Visual Polish
1. Improve graphics (better dinosaur sprite, cacti, ground)
2. Add particle effects (optional)
3. Add sound effects (optional)
4. Improve animations and transitions

### Phase 8: Testing & Refinement
1. Test on different screen sizes
2. Balance difficulty curve
3. Fix bugs and edge cases
4. Optimize performance

## ✨ Features List

### Core Features (MVP)
- ✅ Dinosaur character that can jump
- ✅ Obstacles (cacti) moving from right to left
- ✅ Collision detection
- ✅ Score system
- ✅ Game over and restart
- ✅ Increasing difficulty (speed)
- ✅ Keyboard controls (SPACE/UP to jump)

### Enhanced Features (Nice to Have)
- 🌟 Duck mechanic (DOWN arrow)
- 🌟 Multiple obstacle types
- 🌟 Cloud background elements
- 🌟 Day/night cycle
- 🌟 High score persistence
- 🌟 Sound effects and background music
- 🌟 Particle effects on collision
- 🌟 Mobile touch controls
- 🌟 Pause functionality
- 🌟 Multiple difficulty levels

## 🎨 Visual Design

### Color Scheme
- **Sky**: Light blue gradient (#87CEEB to #E0F6FF)
- **Ground**: Brown/tan (#8B7355)
- **Dinosaur**: Dark gray/black (#333333)
- **Cacti**: Green (#2D5016)
- **Text**: White/Black for contrast

### Canvas Dimensions
- Default: 800x200 pixels (similar to Chrome game)
- Responsive: Scales to fit viewport while maintaining aspect ratio

## 🔧 Technical Details

### Game Loop
- **RequestAnimationFrame**: For smooth 60 FPS rendering
- **Delta time**: For consistent physics regardless of frame rate
- **Update cycle**: Update game state → Clear canvas → Draw elements

### Physics
- **Gravity**: Constant downward acceleration (~0.8 pixels/frame²)
- **Jump velocity**: Initial upward velocity (~15-20 pixels/frame)
- **Ground level**: Fixed Y position at bottom of canvas

### Collision Detection
- **AABB (Axis-Aligned Bounding Box)**: Simple rectangle collision
- **Collision boxes**: Slightly smaller than visual sprites for better gameplay feel

### Performance Optimization
- Object pooling for obstacles (reuse instead of create/destroy)
- Efficient rendering (only redraw changed areas if possible)
- Throttle score updates

## 📋 Development Checklist

- [x] Project structure setup
- [x] HTML/CSS foundation
- [x] Canvas initialization
- [x] Game loop implementation
- [x] Player class and controls
- [x] Obstacle spawning system
- [x] Collision detection
- [x] Game state management
- [x] Score system
- [x] Visual improvements
- [x] Testing and bug fixes
- [x] Documentation

## 🎯 Success Criteria

1. Game is playable and fun
2. Smooth 60 FPS gameplay
3. Responsive controls
4. Clear visual feedback
5. Increasing difficulty provides challenge
6. Works in modern browsers
7. Clean, maintainable code

## 📝 Notes

- Start with simple shapes (rectangles) for MVP
- Can enhance with sprites/images later
- Keep code modular and well-commented
- Test frequently during development
- Consider mobile responsiveness from the start

---

**Ready to proceed?** Review this plan and let me know if you'd like any modifications before we start implementation!

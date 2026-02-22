# Dinosaur Runner Game

A browser-based endless runner game inspired by Chrome's offline T-Rex game. Jump over cacti as the game speeds up!

## How to Play

1. Open `index.html` in a modern web browser
2. Press **SPACE** or **click** to start
3. Press **SPACE** or **UP ARROW** to jump over obstacles
4. Press **P** to pause
5. Press **SPACE** or **R** to restart after game over
6. On mobile: tap to jump/start/restart

## Features

- Endless runner gameplay
- Increasing difficulty (speed ramps up over time)
- Score and high score (saved in browser)
- Pause functionality
- Touch support for mobile
- Responsive design

## Tech Stack

- Vanilla JavaScript
- HTML5 Canvas
- CSS3
- No external dependencies

## Project Structure

```
games/
├── index.html
├── css/style.css
├── js/
│   ├── game.js      # Main game logic
│   ├── player.js    # Dinosaur character
│   ├── obstacle.js  # Cacti obstacles
│   └── utils.js     # Utilities
├── GAME_PLAN.md     # Development plan
└── README.md
```

## Browser Support

Works in all modern browsers (Chrome, Firefox, Safari, Edge).

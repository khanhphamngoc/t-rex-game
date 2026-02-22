// Main game file - Phases 4-8: Collision, Scoring, Polish

class Game {
    constructor() {
        // Get canvas and context
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        // Game state
        this.state = 'MENU'; // MENU, PLAYING, GAME_OVER, PAUSED
        
        // Set up responsive canvas
        this.setupCanvas();
        
        // Initialize player
        this.player = null;
        
        // Obstacle system
        this.obstacles = [];
        this.obstacleSpawnTimer = 0;
        this.obstacleSpawnInterval = 2000; // Base spawn interval (decreases with difficulty)
        this.minObstacleSpacing = 300;
        this.lastObstacleX = 0;
        
        // Scoring & difficulty (Phase 6)
        this.score = 0;
        this.highScore = parseInt(localStorage.getItem('dinoHighScore') || '0', 10);
        this.gameTime = 0; // Total milliseconds playing
        this.gameSpeed = 1;
        this.baseSpeed = 5;
        this.maxSpeed = 15;
        this.speedIncreaseInterval = 5000; // Increase speed every 5 seconds
        
        // Speed burst system (random speed-ups)
        this.speedBurstActive = false;
        this.speedBurstTimer = 0;
        this.speedBurstDuration = 1500; // Burst lasts 1.5 seconds
        this.speedBurstCooldown = 0;
        this.speedBurstCooldownDuration = 4000; // Min 4 seconds between bursts
        this.speedBurstMultiplier = 1.8; // 80% faster during burst
        
        // Voice warning system
        this.warningCooldown = 0; // Cooldown timer to avoid spam
        this.warningCooldownDuration = 2000; // 2 seconds between warnings
        this.warningDistance = 100; // Distance threshold to trigger warning
        this.setupVoice();
        
        // Update start screen high score display
        this.updateStartScreenHighScore();
        
        // Handle window resize
        window.addEventListener('resize', () => {
            this.setupCanvas();
            if (this.player) {
                this.player.updateGroundLevel();
            }
        });
        
        // Initialize game loop
        this.lastTime = 0;
        this.animate(0);
        
        // Set up event listeners
        this.setupEventListeners();
    }
    
    /**
     * Set up voice synthesis for warnings
     */
    setupVoice() {
        this.synth = window.speechSynthesis;
        this.warningUtterance = null;
        
        // Prepare the warning message
        this.prepareWarningVoice();
    }
    
    /**
     * Prepare the warning voice utterance
     */
    prepareWarningVoice() {
        if (!this.synth) return;
        
        this.warningUtterance = new SpeechSynthesisUtterance('Ái, chết tui');
        this.warningUtterance.lang = 'vi-VN'; // Vietnamese
        this.warningUtterance.rate = 1.2; // Slightly faster for urgency
        this.warningUtterance.pitch = 1.2; // Higher pitch for alarm
        this.warningUtterance.volume = 1.0;
    }
    
    /**
     * Play warning voice when obstacle is close
     */
    playWarningVoice() {
        if (!this.synth || !this.warningUtterance) return;
        if (this.warningCooldown > 0) return; // Still on cooldown
        
        // Cancel any ongoing speech
        this.synth.cancel();
        
        // Speak the warning
        this.synth.speak(this.warningUtterance);
        
        // Set cooldown
        this.warningCooldown = this.warningCooldownDuration;
    }
    
    /**
     * Set up responsive canvas sizing
     */
    setupCanvas() {
        // Default game dimensions (similar to Chrome game)
        const defaultWidth = 800;
        const defaultHeight = 200;
        const aspectRatio = defaultWidth / defaultHeight;
        
        // Get available space
        const maxWidth = window.innerWidth - 40; // 20px padding on each side
        const maxHeight = window.innerHeight - 40;
        
        let width, height;
        
        // Calculate dimensions maintaining aspect ratio
        if (maxWidth / aspectRatio <= maxHeight) {
            // Width is the limiting factor
            width = maxWidth;
            height = width / aspectRatio;
        } else {
            // Height is the limiting factor
            height = maxHeight;
            width = height * aspectRatio;
        }
        
        // Set canvas size
        this.canvas.width = width;
        this.canvas.height = height;
        
        // Store dimensions for game logic
        this.width = width;
        this.height = height;
    }
    
    /**
     * Set up keyboard event listeners
     */
    setupEventListeners() {
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space' || e.key === ' ') {
                e.preventDefault();
                this.handleSpaceKey();
            } else if (e.code === 'ArrowUp' || e.key === 'ArrowUp') {
                e.preventDefault();
                if (this.state === 'PLAYING' && this.player) {
                    this.player.jump();
                }
            } else if (e.code === 'ArrowLeft' || e.key === 'ArrowLeft') {
                e.preventDefault();
                if (this.state === 'PLAYING' && this.player) {
                    this.player.movingLeft = true;
                }
            } else if (e.code === 'ArrowRight' || e.key === 'ArrowRight') {
                e.preventDefault();
                if (this.state === 'PLAYING' && this.player) {
                    this.player.movingRight = true;
                }
            }
        });
        
        document.addEventListener('keyup', (e) => {
            if (e.code === 'ArrowLeft' || e.key === 'ArrowLeft') {
                if (this.player) this.player.movingLeft = false;
            } else if (e.code === 'ArrowRight' || e.key === 'ArrowRight') {
                if (this.player) this.player.movingRight = false;
            }
        });
        
        document.addEventListener('keydown', (e) => {
            if (e.code === 'KeyR' || e.key === 'r' || e.key === 'R') {
                if (this.state === 'GAME_OVER') {
                    this.restart();
                }
            } else if (e.code === 'KeyP' || e.key === 'p' || e.key === 'P') {
                if (this.state === 'PLAYING') {
                    this.togglePause();
                }
            } else if (e.code === 'Escape') {
                if (this.state === 'PAUSED') {
                    this.togglePause();
                }
            }
        });
        
        // Click to restart on game over
        document.getElementById('gameOverScreen').addEventListener('click', () => {
            if (this.state === 'GAME_OVER') {
                this.restart();
            }
        });
        
        document.getElementById('startScreen').addEventListener('click', () => {
            if (this.state === 'MENU') {
                this.start();
            }
        });
        
        // Touch support for mobile (jump on tap)
        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            if (this.state === 'MENU') {
                this.start();
            } else if (this.state === 'PLAYING' && this.player) {
                this.player.jump();
            } else if (this.state === 'GAME_OVER') {
                this.restart();
            }
        }, { passive: false });
    }
    
    /**
     * Handle space key press
     */
    handleSpaceKey() {
        if (this.state === 'MENU') {
            this.start();
        } else if (this.state === 'PLAYING') {
            // Jump
            if (this.player) {
                this.player.jump();
            }
        } else if (this.state === 'GAME_OVER') {
            this.restart();
        }
    }
    
    /**
     * Start the game
     */
    start() {
        this.state = 'PLAYING';
        this.score = 0;
        this.gameTime = 0;
        this.gameSpeed = 1;
        
        // Reset speed burst system
        this.speedBurstActive = false;
        this.speedBurstTimer = 0;
        this.speedBurstCooldown = 0;
        
        document.getElementById('startScreen').classList.add('hidden');
        document.getElementById('gameOverScreen').classList.add('hidden');
        document.getElementById('scoreDisplay').classList.remove('hidden');
        document.getElementById('highScoreMsg').classList.add('hidden');
        
        this.updateScoreDisplay();
        
        // Initialize player if not already created
        if (!this.player) {
            this.player = new Player(this);
        } else {
            this.player.reset();
        }
        
        // Reset obstacles
        this.obstacles = [];
        this.obstacleSpawnTimer = 0;
        this.lastObstacleX = this.width;
    }
    
    /**
     * Game over
     */
    gameOver() {
        this.state = 'GAME_OVER';
        document.getElementById('scoreDisplay').classList.add('hidden');
        document.getElementById('gameOverScreen').classList.remove('hidden');
        document.getElementById('finalScore').textContent = this.score;
        
        if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem('dinoHighScore', this.highScore.toString());
            document.getElementById('highScoreMsg').classList.remove('hidden');
        } else {
            document.getElementById('highScoreMsg').classList.add('hidden');
        }
        this.updateStartScreenHighScore();
    }
    
    /**
     * Restart the game
     */
    restart() {
        this.state = 'MENU';
        document.getElementById('startScreen').classList.remove('hidden');
        document.getElementById('gameOverScreen').classList.add('hidden');
        document.getElementById('scoreDisplay').classList.add('hidden');
        
        if (this.player) {
            this.player.reset();
        }
        
        this.obstacles = [];
        this.obstacleSpawnTimer = 0;
        this.lastObstacleX = this.width;
    }
    
    /**
     * Toggle pause state
     */
    togglePause() {
        this.state = this.state === 'PAUSED' ? 'PLAYING' : 'PAUSED';
    }
    
    /**
     * Update score display
     */
    updateScoreDisplay() {
        const currentEl = document.getElementById('currentScore');
        const highEl = document.getElementById('highScore');
        if (currentEl) currentEl.textContent = this.score;
        if (highEl) highEl.textContent = this.highScore;
    }
    
    /**
     * Update high score on start screen
     */
    updateStartScreenHighScore() {
        const el = document.getElementById('startHighScore');
        if (el) el.textContent = 'Best: ' + this.highScore;
    }
    
    /**
     * Get a random obstacle type with weights
     */
    getRandomObstacleType(includeSpecial = true) {
        const randomValue = Math.random();
        
        if (includeSpecial && this.gameTime > 10000) {
            // After 10 seconds, introduce special types
            // 35% small, 25% medium, 20% large, 12% giant, 8% wide
            if (randomValue < 0.35) return 'small';
            if (randomValue < 0.60) return 'medium';
            if (randomValue < 0.80) return 'large';
            if (randomValue < 0.92) return 'giant';
            return 'wide';
        } else {
            // Early game: normal types only
            // 40% small, 35% medium, 25% large
            if (randomValue < 0.40) return 'small';
            if (randomValue < 0.75) return 'medium';
            return 'large';
        }
    }
    
    /**
     * Get random spacing between obstacles (more unpredictable)
     */
    getRandomSpacing() {
        const roll = Math.random();
        
        if (roll < 0.2) {
            // 20% chance: very short spacing (challenging)
            return random(150, 250);
        } else if (roll < 0.5) {
            // 30% chance: short spacing
            return random(250, 350);
        } else if (roll < 0.8) {
            // 30% chance: medium spacing
            return random(350, 500);
        } else {
            // 20% chance: long spacing (breather)
            return random(500, 700);
        }
    }
    
    /**
     * Spawn a new obstacle or obstacle group
     */
    spawnObstacle() {
        // 40% chance to spawn a group of cacti, 60% chance for single cactus
        const spawnGroup = Math.random() < 0.4;
        
        if (spawnGroup) {
            // Spawn a group of 2-5 cacti close together
            const groupSize = random(2, 5);
            const groupSpacing = random(15, 35); // Tight spacing between cacti in group
            
            // Random spacing before this group
            const spacing = this.getRandomSpacing();
            let groupStartX = Math.max(this.width, this.lastObstacleX + spacing);
            
            let lastXInGroup = groupStartX;
            
            for (let i = 0; i < groupSize; i++) {
                // Random type (no giant/wide in groups - too hard)
                const type = this.getRandomObstacleType(false);
                
                // Create obstacle at current position
                const obstacle = new Obstacle(this, lastXInGroup, type);
                this.obstacles.push(obstacle);
                
                // Calculate next cactus position in group
                lastXInGroup += obstacle.width + groupSpacing;
            }
            
            // Update last obstacle X to the end of the group
            this.lastObstacleX = lastXInGroup;
        } else {
            // Spawn single obstacle (can include special types)
            const type = this.getRandomObstacleType(true);
            
            // Random spacing
            const spacing = this.getRandomSpacing();
            const spawnX = Math.max(this.width, this.lastObstacleX + spacing);
            
            // Create new obstacle
            const obstacle = new Obstacle(this, spawnX, type);
            this.obstacles.push(obstacle);
            this.lastObstacleX = spawnX;
        }
    }
    
    /**
     * Update game state
     */
    update(deltaTime) {
        if (this.state === 'PAUSED') return;
        
        if (this.state === 'PLAYING') {
            this.gameTime += deltaTime;
            
            // Score: 1 point per 100ms survived
            this.score = Math.floor(this.gameTime / 100);
            this.updateScoreDisplay();
            
            // Difficulty scaling: increase speed over time
            const speedLevels = Math.floor(this.gameTime / this.speedIncreaseInterval);
            let baseGameSpeed = Math.min(
                1 + speedLevels * 0.2,
                this.maxSpeed / this.baseSpeed
            );
            
            // Speed burst system - random sudden speed-ups
            if (this.speedBurstCooldown > 0) {
                this.speedBurstCooldown -= deltaTime;
            }
            
            if (this.speedBurstActive) {
                this.speedBurstTimer -= deltaTime;
                if (this.speedBurstTimer <= 0) {
                    this.speedBurstActive = false;
                    this.speedBurstCooldown = this.speedBurstCooldownDuration;
                }
            } else if (this.speedBurstCooldown <= 0 && this.gameTime > 5000) {
                // 3% chance per frame to trigger a speed burst (after 5 seconds)
                if (Math.random() < 0.03) {
                    this.speedBurstActive = true;
                    this.speedBurstTimer = this.speedBurstDuration;
                }
            }
            
            // Apply speed burst multiplier
            this.gameSpeed = this.speedBurstActive 
                ? baseGameSpeed * this.speedBurstMultiplier 
                : baseGameSpeed;
            
            // Faster spawn at higher speeds
            this.obstacleSpawnInterval = Math.max(800, 2000 - speedLevels * 200);
            
            // Update warning cooldown
            if (this.warningCooldown > 0) {
                this.warningCooldown -= deltaTime;
            }
            
            // Update player
            if (this.player) {
                this.player.update(deltaTime);
                
                // Collision detection (Phase 4)
                const playerBox = this.player.getCollisionBox();
                const collisionPadding = 8; // Slightly smaller hitbox for fairness
                
                for (const obstacle of this.obstacles) {
                    const obstacleBox = obstacle.getCollisionBox();
                    
                    // Check for collision
                    if (checkCollision(playerBox, obstacleBox, collisionPadding)) {
                        this.gameOver();
                        return;
                    }
                    
                    // Check proximity for warning voice
                    const distanceX = obstacleBox.x - (playerBox.x + playerBox.width);
                    if (distanceX > 0 && distanceX < this.warningDistance) {
                        // Obstacle is close but not yet colliding - play warning!
                        this.playWarningVoice();
                    }
                }
            }
            
            // Update obstacle spawn timer
            this.obstacleSpawnTimer += deltaTime;
            if (this.obstacleSpawnTimer >= this.obstacleSpawnInterval) {
                this.spawnObstacle();
                this.obstacleSpawnTimer = 0;
            }
            
            // Update obstacles
            for (let i = this.obstacles.length - 1; i >= 0; i--) {
                const obstacle = this.obstacles[i];
                obstacle.update(deltaTime, this.gameSpeed);
                
                if (obstacle.isOffScreen()) {
                    this.obstacles.splice(i, 1);
                }
            }
        }
    }
    
    /**
     * Render game
     */
    render() {
        const groundY = this.height * 0.75;
        
        // Sky gradient
        const skyGradient = this.ctx.createLinearGradient(0, 0, 0, this.height);
        skyGradient.addColorStop(0, '#87CEEB');
        skyGradient.addColorStop(0.5, '#B8E4F0');
        skyGradient.addColorStop(1, '#E0F6FF');
        this.ctx.fillStyle = skyGradient;
        this.ctx.fillRect(0, 0, this.width, groundY);
        
        // Clouds (Phase 7 - visual polish)
        if (this.state === 'PLAYING' || this.state === 'PAUSED') {
            this.drawClouds(groundY);
        }
        
        // Ground with scrolling effect (Phase 7)
        this.drawGround(groundY);
        
        // Draw obstacles
        if (this.state === 'PLAYING' || this.state === 'PAUSED') {
            for (const obstacle of this.obstacles) {
                obstacle.draw(this.ctx);
            }
        }
        
        // Draw player
        if (this.player && (this.state === 'PLAYING' || this.state === 'PAUSED')) {
            this.player.draw(this.ctx);
        }
        
        // Speed burst indicator
        if (this.speedBurstActive && this.state === 'PLAYING') {
            // Flashing red border effect
            const flashIntensity = Math.sin(Date.now() / 50) * 0.3 + 0.5;
            this.ctx.strokeStyle = `rgba(255, 0, 0, ${flashIntensity})`;
            this.ctx.lineWidth = 6;
            this.ctx.strokeRect(3, 3, this.width - 6, this.height - 6);
            
            // Warning text
            this.ctx.fillStyle = `rgba(255, 50, 50, ${flashIntensity + 0.3})`;
            this.ctx.font = 'bold 16px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('SPEED BURST!', this.width / 2, 25);
        }
        
        // Pause overlay
        if (this.state === 'PAUSED') {
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
            this.ctx.fillRect(0, 0, this.width, this.height);
            this.ctx.fillStyle = '#FFF';
            this.ctx.font = 'bold 24px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('PAUSED - Press P or ESC to continue', this.width / 2, this.height / 2);
        }
    }
    
    /**
     * Draw decorative clouds
     */
    drawClouds(groundY) {
        const time = (this.gameTime || 0) / 1000;
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        
        for (let i = 0; i < 3; i++) {
            const baseX = ((time * 20 + i * 150) % (this.width + 100)) - 50;
            const y = groundY * (0.2 + i * 0.15);
            this.ctx.beginPath();
            this.ctx.arc(baseX, y, 15, 0, Math.PI * 2);
            this.ctx.arc(baseX + 20, y - 5, 20, 0, Math.PI * 2);
            this.ctx.arc(baseX + 45, y, 15, 0, Math.PI * 2);
            this.ctx.fill();
        }
    }
    
    /**
     * Draw ground with scrolling line pattern
     */
    drawGround(groundY) {
        this.ctx.fillStyle = '#8B7355';
        this.ctx.fillRect(0, groundY, this.width, this.height - groundY);
        
        // Scrolling ground line
        const scrollOffset = ((this.gameTime || 0) / 10) % 30;
        this.ctx.strokeStyle = '#6B5B45';
        this.ctx.lineWidth = 2;
        for (let x = -scrollOffset; x < this.width + 30; x += 30) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, groundY);
            this.ctx.lineTo(x + 20, groundY);
            this.ctx.stroke();
        }
    }
    
    /**
     * Main game loop using requestAnimationFrame
     */
    animate(currentTime) {
        // Calculate delta time
        const deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;
        
        // Update and render
        this.update(deltaTime);
        this.render();
        
        // Continue animation loop
        requestAnimationFrame((time) => this.animate(time));
    }
}

// Initialize game when page loads
window.addEventListener('load', () => {
    const game = new Game();
    // Make game instance globally accessible for other scripts
    window.game = game;
});

// Obstacle class - Phase 3: Obstacle System

class Obstacle {
    constructor(game, x, type = 'small') {
        this.game = game;
        this.type = type; // 'small', 'medium', 'large', 'giant', 'wide'
        
        // Dimensions based on type
        const dimensions = this.getDimensions();
        this.width = dimensions.width;
        this.height = dimensions.height;
        
        // Position
        this.x = x; // Starting X position (right side of screen)
        this.groundY = this.game.height * 0.75;
        this.y = this.groundY - this.height; // Y position at ground level
        
        // Movement
        this.speed = 5; // Base speed (will be modified by game speed)
    }
    
    /**
     * Get dimensions based on obstacle type
     */
    getDimensions() {
        const baseSize = 20; // Base size unit
        
        switch (this.type) {
            case 'small':
                return {
                    width: baseSize * 0.8,
                    height: baseSize * 1.2
                };
            case 'medium':
                return {
                    width: baseSize * 1.0,
                    height: baseSize * 1.8
                };
            case 'large':
                return {
                    width: baseSize * 1.2,
                    height: baseSize * 2.5
                };
            case 'giant':
                // Extra tall - requires early jump!
                return {
                    width: baseSize * 1.4,
                    height: baseSize * 3.5
                };
            case 'wide':
                // Wide obstacle - harder to clear
                return {
                    width: baseSize * 2.5,
                    height: baseSize * 2.0
                };
            default:
                return {
                    width: baseSize,
                    height: baseSize * 1.5
                };
        }
    }
    
    /**
     * Update obstacle position
     */
    update(deltaTime, gameSpeed = 1) {
        // Normalize deltaTime to frame-based calculations
        const frameTime = deltaTime / 16.67;
        
        // Move left (negative X direction)
        this.x -= this.speed * gameSpeed * frameTime;
    }
    
    /**
     * Check if obstacle is off-screen
     */
    isOffScreen() {
        return this.x + this.width < 0;
    }
    
    /**
     * Draw the obstacle (cactus)
     */
    draw(ctx) {
        // Giant cacti have a reddish tint as warning
        if (this.type === 'giant') {
            ctx.fillStyle = '#8B0000'; // Dark red for dangerous giant
        } else if (this.type === 'wide') {
            ctx.fillStyle = '#4A6B2A'; // Lighter green for wide
        } else {
            ctx.fillStyle = '#2D5016'; // Dark green for normal cactus
        }
        
        // Draw main body
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        // Draw cactus arms/branches based on type
        if (this.type === 'medium' || this.type === 'large' || this.type === 'giant') {
            // Left arm
            const armWidth = this.width * 0.4;
            const armHeight = this.height * 0.4;
            ctx.fillRect(
                this.x - armWidth * 0.7,
                this.y + this.height * 0.3,
                armWidth,
                armHeight
            );
            
            // Right arm
            ctx.fillRect(
                this.x + this.width - armWidth * 0.3,
                this.y + this.height * 0.4,
                armWidth,
                armHeight
            );
            
            // Giant gets extra arms at top
            if (this.type === 'giant') {
                ctx.fillRect(
                    this.x - armWidth * 0.5,
                    this.y + this.height * 0.1,
                    armWidth * 0.8,
                    armHeight * 0.6
                );
                ctx.fillRect(
                    this.x + this.width - armWidth * 0.3,
                    this.y + this.height * 0.15,
                    armWidth * 0.8,
                    armHeight * 0.6
                );
            }
        }
        
        // Add some texture/details (small rectangles for spikes)
        const detailColor = this.type === 'giant' ? '#5C0000' : '#1A3A0D';
        ctx.fillStyle = detailColor;
        const spikeSize = 2;
        const numSpikes = this.type === 'wide' ? 5 : 3;
        for (let i = 0; i < numSpikes; i++) {
            ctx.fillRect(
                this.x + this.width * 0.15 + i * (this.width * 0.2),
                this.y + this.height * 0.2,
                spikeSize,
                spikeSize
            );
        }
    }
    
    /**
     * Get collision box for collision detection
     */
    getCollisionBox() {
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height
        };
    }
}

// Player class - Phase 2 & 7: Player with running animation

class Player {
    constructor(game) {
        this.game = game;
        
        // Dimensions
        this.width = 40;
        this.height = 50;
        
        // Position (variable X for left/right, variable Y for jumping)
        this.x = 80;
        this.y = 0;
        
        // Horizontal movement
        this.moveSpeed = 8;
        this.movingLeft = false;
        this.movingRight = false;
        
        // Physics
        this.velocityY = 0;
        this.gravity = 0.6;
        this.jumpVelocity = -15;
        
        // State
        this.isJumping = false;
        this.isOnGround = true;
        this.animFrame = 0; // For running animation
        
        // Ground level
        this.groundY = this.game.height * 0.75;
        this.y = this.groundY - this.height;
    }
    
    /**
     * Update player position and physics
     */
    update(deltaTime) {
        const frameTime = deltaTime / 16.67;
        
        // Horizontal movement
        if (this.movingLeft) {
            this.x -= this.moveSpeed * frameTime;
        }
        if (this.movingRight) {
            this.x += this.moveSpeed * frameTime;
        }
        // Keep player within canvas bounds
        this.x = clamp(this.x, 0, this.game.width - this.width);
        
        if (!this.isOnGround) {
            this.velocityY += this.gravity * frameTime;
        }
        
        this.y += this.velocityY * frameTime;
        
        const groundLevel = this.groundY - this.height;
        if (this.y >= groundLevel) {
            this.y = groundLevel;
            this.velocityY = 0;
            this.isOnGround = true;
            this.isJumping = false;
        } else {
            this.isOnGround = false;
        }
        
        // Running animation frame
        if (this.isOnGround) {
            this.animFrame += deltaTime;
        }
    }
    
    /**
     * Make the player jump
     */
    jump() {
        // Only jump if on ground
        if (this.isOnGround && !this.isJumping) {
            this.velocityY = this.jumpVelocity;
            this.isJumping = true;
            this.isOnGround = false;
        }
    }
    
    /**
     * Reset player to initial state
     */
    reset() {
        this.x = 80;
        this.y = this.groundY - this.height;
        this.velocityY = 0;
        this.movingLeft = false;
        this.movingRight = false;
        this.isJumping = false;
        this.isOnGround = true;
    }
    
    /**
     * Update ground level when canvas resizes
     */
    updateGroundLevel() {
        this.groundY = this.game.height * 0.75;
        // Adjust Y position if needed
        if (this.isOnGround) {
            this.y = this.groundY - this.height;
        }
    }
    
    /**
     * Draw a 5-pointed star (Vietnam flag star)
     */
    drawStar(ctx, cx, cy, outerRadius) {
        const innerRadius = outerRadius * 0.4;
        ctx.beginPath();
        for (let i = 0; i < 10; i++) {
            const radius = i % 2 === 0 ? outerRadius : innerRadius;
            const angle = (Math.PI * 2 * i) / 10 - Math.PI / 2; // Start from top
            const x = cx + Math.cos(angle) * radius;
            const y = cy + Math.sin(angle) * radius;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.fill();
    }
    
    /**
     * Draw the dinosaur (with running animation and Vietnam flag T-shirt)
     */
    draw(ctx) {
        const headWidth = this.width * 0.6;
        const headHeight = this.height * 0.4;
        
        // Body (dinosaur skin - visible at neck and where shirt doesn't cover)
        ctx.fillStyle = '#333333';
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        // Vietnam flag T-shirt: red with yellow star
        const shirtPadding = 4;
        const shirtX = this.x + shirtPadding;
        const shirtY = this.y + headHeight * 0.3; // Below neck
        const shirtW = this.width - shirtPadding * 2;
        const shirtH = this.height * 0.7; // Most of torso
        
        ctx.fillStyle = '#DA251D'; // Vietnam flag red
        ctx.fillRect(shirtX, shirtY, shirtW, shirtH);
        
        // Yellow star on T-shirt (Vietnam flag)
        const starCx = this.x + this.width / 2;
        const starCy = shirtY + shirtH / 2;
        ctx.fillStyle = '#FFFF00'; // Vietnam flag yellow
        this.drawStar(ctx, starCx, starCy, 8);
        
        // Head
        ctx.fillStyle = '#333333';
        ctx.fillRect(
            this.x + (this.width - headWidth) / 2,
            this.y - headHeight,
            headWidth,
            headHeight
        );
        
        // Legs with running animation (alternate based on animFrame)
        const legWidth = this.width * 0.2;
        const legHeight = this.height * 0.25;
        const frame = Math.floor(this.animFrame / 80) % 2; // Alternate every 80ms
        
        if (this.isJumping) {
            // Both legs tucked when jumping
            ctx.fillRect(this.x + this.width * 0.2, this.y + this.height - 5, legWidth, 8);
            ctx.fillRect(this.x + this.width * 0.6, this.y + this.height - 5, legWidth, 8);
        } else {
            // Running animation
            const legOffset = frame === 0 ? 5 : -5;
            ctx.fillRect(
                this.x + this.width * 0.2,
                this.y + this.height,
                legWidth,
                legHeight + (frame === 0 ? legOffset : -legOffset)
            );
            ctx.fillRect(
                this.x + this.width * 0.6,
                this.y + this.height,
                legWidth,
                legHeight + (frame === 1 ? legOffset : -legOffset)
            );
        }
        
        // Eye
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(
            this.x + this.width * 0.7,
            this.y - headHeight * 0.5,
            3,
            0,
            Math.PI * 2
        );
        ctx.fill();
        
        ctx.fillStyle = '#333333';
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

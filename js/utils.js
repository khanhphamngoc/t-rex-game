// Utility functions

/**
 * Get a random number between min and max (inclusive)
 */
function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Clamp a value between min and max
 */
function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}

/**
 * Check if two rectangles are colliding (AABB collision detection)
 * Optional padding shrinks collision boxes for fairer gameplay
 */
function checkCollision(rect1, rect2, padding = 0) {
    const r1 = {
        x: rect1.x + padding,
        y: rect1.y + padding,
        width: rect1.width - padding * 2,
        height: rect1.height - padding * 2
    };
    const r2 = {
        x: rect2.x + padding,
        y: rect2.y + padding,
        width: rect2.width - padding * 2,
        height: rect2.height - padding * 2
    };
    return r1.x < r2.x + r2.width &&
           r1.x + r1.width > r2.x &&
           r1.y < r2.y + r2.height &&
           r1.y + r1.height > r2.y;
}

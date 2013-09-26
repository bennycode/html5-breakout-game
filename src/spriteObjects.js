/**
 * Create new sprites by making new instances of this "spriteObject" and customizing it. 
 * 
 * TODO: Don't pollute the global namespace!
 */
var spriteObject = {
  // The location and size of the image that represents the sprite on the tilesheet.
  sourceX: 0,
  sourceY: 0,
  sourceWidth: 64,
  sourceHeight: 64,
  // The size and location of the sprite on the canvas
  height: 64,
  width: 64,
  x: 0,
  y: 0,
  // The sprite's velocity
  vx: 0,
  vy: 0,
  // Will the sprite be visible when it first loads?
  visible: true,
  /**
   * Getters:
   * Any calculated in information that the main program might need from the sprite. 
   * In this example the getters return the center x and y position of the sprite, 
   * as well as its half-width and half-height.
   */
  centerX: function() {
    return this.x + (this.width / 2);
  },
  centerY: function() {
    return this.y + (this.height / 2);
  },
  halfWidth: function() {
    return this.width / 2;
  },
  halfHeight: function() {
    return this.height / 2;
  }
};

/**
 * Used to position and display game messages. Assign new values to the default 
 * properties when you create a new message from this object.
 * 
 * TODO: Don't pollute the global namespace!
 */
var messageObject = {
  x: 0,
  y: 0,
  visible: true,
  text: "Message",
  font: "puzzler",
  fillStyle: "red",
  textBaseline: "top"
};	
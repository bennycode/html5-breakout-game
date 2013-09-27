var Breakout = Breakout || {};

Breakout.SpriteObject = function SpriteObject() {
  // The location and size of the image 
  // that represents the sprite on the sprite sheet
  this.sourceX = 0;
  this.sourceY = 0;
  this.sourceWidth = 64;
  this.sourceHeight = 64;

  // The size and location of the sprite on the canvas
  this.height = 64;
  this.width = 64;
  this.x = 0;
  this.y = 0;

  // The object's velocity
  this.vx = 0;
  this.vy = 0;

  // Will the sprite be visible when it first loads?
  this.isVisible = true;
};

Breakout.SpriteObject.prototype = {
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
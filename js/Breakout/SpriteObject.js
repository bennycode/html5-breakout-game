var Breakout = Breakout || {};

Breakout.SpriteObject = function SpriteObject(config) {
  // The location and size of the image 
  // that represents the sprite on the sprite sheet
  this.sourceX = config.sourceX || 0;
  this.sourceY = config.sourceY || 0;
  this.sourceWidth = config.sourceWidth || 64;
  this.sourceHeight = config.sourceHeight || 64;

  // The size and location of the sprite on the canvas
  this.height = config.height || 64;
  this.width = config.width || 64;
  this.x = config.x || 0;
  this.y = config.y || 0;

  // The object's velocity
  this.vx = config.vx || 0;
  this.vy = config.vy || 0;

  // Will the sprite be visible when it first loads?
  // TODO: change to isVisible
  this.visible = config.visible || true;
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
  },
  setPosition: function(point) {
    this.x = point.x;
    this.y = point.y;
  },
  setVelocity: function(velocity) {
    this.vx = velocity.x;
    this.vy = velocity.y;
  }
};
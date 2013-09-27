// Create the canvas and hide the mouse pointer
var canvas = document.querySelector("canvas");
var context = canvas.getContext("2d");
canvas.style.cursor = "none";

/**
 * Arrays to manage the sprites, messages and other assets.
 */
var sprites = [];
var messages = [];
var assetsToLoad = [];
var assetsLoaded = 0;

// Brick settings
var ROWS = 5;
var COLUMNS = 8;
var SIZE = 64;
var tilesheetColumns = 3;

// Variables used to help track the position of the mouse on the canvas
var mouseX = 0;
var mouseY = 0;

// Game state variables
var collision = false;
var score = 0;
var blocks = [];

/**
 * Game states: 
 * The game's initial state is set to "LOADING"	
 */
var LOADING = 0;
var BUILD_MAP = 1;
var PLAYING = 2;
var OVER = 3;
var gameState = LOADING;

// The paddle
// var paddle = new Breakout.SpriteObject();
var paddle = Object.create(spriteObject);
paddle.sourceX = 0;
paddle.sourceY = 0;
paddle.sourceHeight = 16;
paddle.height = 18;
paddle.x = canvas.width / 2 - paddle.halfWidth();
paddle.y = paddle.y = canvas.height - 16;
sprites.push(paddle);

// The ball
var ball = Object.create(spriteObject);
ball.sourceX = 64;
ball.sourceY = 0;
ball.sourceHeight = 12;
ball.height = 12;
ball.sourceWidth = 12;
ball.width = 12;
ball.x = canvas.width / 2 - ball.halfWidth();
ball.y = ball.y = canvas.height - 128;

// Initial velocity
ball.vy = 5;
ball.vx = 3;
sprites.push(ball);

// Create the gameMessage from the base messageObject
var gameMessage = Object.create(messageObject);
gameMessage.fillStyle = "red";
gameMessage.font = "20px puzzler";
gameMessage.x = 12;
gameMessage.y = 12;
messages.push(gameMessage);

// Load the spritesheets for the tiles
var image = new Image();
image.addEventListener("load", loadHandler, false);
image.src = "images/tileSheet.png";
assetsToLoad.push(image);

// Load the music. Create a WebAudio soundObject
/*
 var music = Object.create(soundObject);
 music.initialize({source: "../sounds/music.mp3", volume: 1, pan: 0, loop: true, singleInstance: true});
 loadSound(music);
 assetsToLoad.push(music);	
 */

// Load the bounce sound
/*
 var bounce = Object.create(soundObject);
 bounce.initialize({source: "../sounds/bounce.mp3", volume: 1, pan: 0, loop: false, singleInstance: false});
 loadSound(bounce);
 assetsToLoad.push(bounce);
 */

// A function to load WebAudio sounds
function loadSound(soundToLoad) {

  soundToLoad.loadSound.open("GET", soundToLoad.source, true);
  soundToLoad.loadSound.responseType = "arraybuffer";
  soundToLoad.loadSound.addEventListener("load", soundLoadHandler, false);

  // ...will be hoisted
  function soundLoadHandler(event) {
    console.log(soundToLoad.source);
    audioContext.decodeAudioData(soundToLoad.loadSound.response, function(buffer)
    {
      soundToLoad.buffer = buffer;
      soundToLoad.hasLoaded = true;

      /**
       * Optional but important:
       * If you have a load manager in your game, 
       * call it here so that the sound is registered as having loaded.
       */
      loadHandler();
    });
  }

  soundToLoad.loadSound.send();
}

/**
 * The "loadHandler" counts the number of assets that need to be loaded.
 * When everything has loaded, it changes the gameState to PLAYING.	  
 */
function loadHandler() {
  assetsLoaded++;
  if (assetsLoaded === assetsToLoad.length) {
    // Start the music
    // music.play();

    // Make the game start playing
    gameState = BUILD_MAP;
    console.log("All assets loaded");
  }
}

// Add a mouse listener and a function that finds the mouse's position on the canvas
canvas.addEventListener("mousemove", mousemoveHandler, false);

function mousemoveHandler(event) {
  // Find the mouse's x and y position.
  // Subtract the canvas's top and left offset.
  mouseX = event.pageX - canvas.offsetLeft;
  mouseY = event.pageY - canvas.offsetTop;
}

//Call the "update" function, which is the main game loop	
update();

function update() {
  //The animation loop
  requestAnimationFrame(update, canvas);

  /**
   * Change what the game is doing based on the game state. 
   * After any assets, like the tilesheet, have loaded, 
   * the game state will change from LOADING to PLAYING.
   */
  switch (gameState) {
    case LOADING:
      break;

    case BUILD_MAP:
      buildMap();
      gameState = PLAYING;
      break;

    case PLAYING:
      playGame();
      break;

    case OVER:
      endGame();
      break;
  }

  //Render the game
  render();
}

/**
 * After the game has loaded the game's state will change to "PLAYING". 
 * The "update" function will then call the "playGame" function, 
 * which runs the game at aproximately 60 frames per second.
 */
function buildMap() {
  for (var row = 0; row < ROWS; row++) {
    for (var column = 0; column < COLUMNS; column++) {
      // Choose a random tile from the bottom row of the tile sheet
      var randomTileXPos = (Math.floor(Math.random() * 3)) * 64;
      var tilesheetX = randomTileXPos;
      var tilesheetY = 64;

      var block = Object.create(spriteObject);
      block.sourceX = tilesheetX;
      block.sourceY = tilesheetY;
      block.x = column * SIZE;
      block.y = row * SIZE;
      blocks.push(block);
      sprites.push(block);
    }
  }
}

function playGame() {
  // Move the paddle to the mouse's position
  paddle.x = mouseX - (paddle.halfWidth());

  // Paddle screen boundaries
  paddle.x = Math.max(0, Math.min(paddle.x + paddle.vx, canvas.width - paddle.width));

  // Move the ball
  ball.x += ball.vx;
  ball.y += ball.vy;

  // Bounce the ball off the screen edges
  // Left
  if (ball.x < 0) {
    ball.vx *= -1;
    ball.x = 0;
    // bounce.play();
  }
  // Up
  if (ball.y < 0) {
    ball.vy *= -1;
    ball.y = 0;
    // bounce.play();
  }
  // Right
  if (ball.x + ball.width > canvas.width) {
    ball.vx *= -1;
    ball.x = canvas.width - ball.width;
    // bounce.play();
  }
  //Down
  if (ball.y + ball.height > canvas.height) {
    ball.vy *= -1;
    ball.y = canvas.height - ball.height;
    // bounce.play();
    // Subtract 1 from the score if the ball hits the bottom of the screen+
    // TODO: Limit score to "0" because atm. it get -1
    score--;
  }

  // Bounce the ball off the paddle
  if (hitTestRectangle(ball, paddle)) {
    blockRectangle(ball, paddle, true);
    // bounce.play();
  }

  // Collision with the blocks
  for (var i = 0; i < blocks.length; i++) {
    var block = blocks[i];

    if (hitTestRectangle(ball, block)) {
      // Play the bounce sound
      // bounce.play();

      // Update the score
      score++;

      // Bounce the ball off the block
      blockRectangle(ball, block, true);

      // Remove the block from the blocks array
      removeObject(block, blocks);

      // Remove the block from the sprites array
      removeObject(block, sprites);

      // Reduce the loop counter by 1 to compensate for the removed element.
      i--;
    }
  }

  // Check for end of game
  if (blocks.length === 0) {
    gameState = OVER;
  }

  gameMessage.text = "Score: " + score;
}

function endGame() {
  gameMessage.x = 70;
  gameMessage.y = 225;
  gameMessage.text = "Game Over! Score: " + score;
}

function removeObject(objectToRemove, array) {
  var i = array.indexOf(objectToRemove);
  if (i !== -1) {
    array.splice(i, 1);
  }
}

/**
 * The render function draws the tilesheet image onto the canvas. 
 * It loops through all the sprites in the game. If they are visible, it copies their image from the tilesheet onto the correct x and y position on the canvas. It also draws the game messages, if there are any.
 */
function render() {
  context.clearRect(0, 0, canvas.width, canvas.height);

  // Display the sprites
  if (sprites.length !== 0) {
    for (var i = 0; i < sprites.length; i++) {

      var sprite = sprites[i];

      if (sprite.visible) {
        // TODO: Use an object as parameter
        context.drawImage(image,
                sprite.sourceX,
                sprite.sourceY,
                sprite.sourceWidth,
                sprite.sourceHeight,
                Math.floor(sprite.x),
                Math.floor(sprite.y),
                sprite.width,
                sprite.height);
      }
    }
  }

  // Display game messages
  if (messages.length !== 0) {
    for (var i = 0; i < messages.length; i++) {
      var message = messages[i];
      if (message.visible) {
        context.font = message.font;
        context.fillStyle = message.fillStyle;
        context.textBaseline = message.textBaseline;
        context.fillText(message.text, message.x, message.y);
      }
    }
  }
}
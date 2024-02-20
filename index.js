// Import stylesheets
import './style.css';
var ball;
var paddle;
var lives = 3;
var score = 0;
var livesText;
var scoreText;
var bricks;
var scene;
var brickInfo = {
  width: 50,
  height: 20,
  count: {
    row: 4,
    col: 12
  },
  offset: {
    top: 90,
    left: 60
  },
  padding: 10
};
var scene;

const gameConfig = { 
  type: Phaser.AUTO,
  parent: 'game',
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false
    }
  },
  scene: {
    create: create,
    update: update
  }
};

const game = new Phaser.Game(gameConfig);



function create() {
  scene = this;

  //sets scene
  paddle = scene.add.rectangle(400, 570, 140, 10, 0xFFFFFF);
  ball = scene.add.circle(400, 300, 10, 0xFFFFFF);
  let lava = scene.add.rectangle(0, 600, 200000, 10, 0x000000);
  scoreText = scene.add.text(16, 16, "Score: " + score, {fontSize: '32px', fill: '#FFF'});
  livesText = scene.add.text(630, 16, "Lives: " + lives, {fontSize: '32px', fill: '#FFF'});


  scene.physics.add.existing(ball);
  scene.physics.add.existing(paddle);
  scene.physics.add.existing(lava);


  //determines ball and paddle movement
  ball.body.velocity.x = 200;
  ball.body.velocity.y = 200;
  ball.body.collideWorldBounds = true;
  ball.body.bounce.y = 1;
  ball.body.bounce.x = 1;

  paddle.body.immovable = true;

  lava.body.immovable = true;

  scene.physics.add.collider(paddle, ball, bounceOffPaddle);
  createBricks();

  scene.physics.add.collider(ball, lava, hitLava)
  scene.input.on("pointermove", function(pointer){
    paddle.setPosition(pointer.x, paddle.y);
  });

}

function update() {
  //resets if out of lives
  if (lives === 0){
    gameOver();
  }
  //resets if out of bricks
  if (score === brickInfo.count.row * brickInfo.count.col){
    gameWin();
  }
}

function bounceOffPaddle() {
  ball.body.velocity.x = -1 * 5 * (paddle.x - ball.x)
}

function createBricks() {
  for (let c = 0; c < brickInfo.count.col; c++){
    for (let r = 0; r < brickInfo.count.row; r++){
      var brickX = (c * (brickInfo.width + brickInfo.padding)) + brickInfo.offset.left;
      var brickY = (r * (brickInfo.height + brickInfo.padding)) + brickInfo.offset.top;
      manage(scene.physics.add.existing(scene.add.rectangle(brickX, brickY, 50, 20,0xFFFFFF)))
    }
  }
}

function manage(brick) {
  brick.body.immovable = true;

  //controls bricks breaking
  scene.physics.add.collider(ball, brick, function(){
    ballHitBrick(brick)
  });
}

function ballHitBrick(brick){
  brick.destroy();

  //add score
  score++;
  //display score
  scoreText.setText("Score: " + score);
}

function hitLava(){
  //subtract lives
  lives --;
  //display scoreboard
  livesText.setText("Lives: " + lives);
}

function gameWin() {
  console.log("You Win!");

  resetGameState();
}
function gameOver() {
  console.log("You Lose!");

  resetGameState();
}

function resetGameState() {
  lives = 3;
  score = 0;
  // Reset text displays
  livesText.setText("Lives: " + lives);
  scoreText.setText("Score: " + score);
  // Recreate bricks
  createBricks();
}

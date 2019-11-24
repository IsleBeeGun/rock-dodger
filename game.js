const gameState = {
  score: 0
};

function preload() {
  this.load.image("sky", "./img/sky.png");
  this.load.image("background", "./img/back.png");
  this.load.image("grass", "./img/grass-back.png");
  this.load.image("rock-1", "./img/rock-1.svg");
  this.load.image("rock-2", "./img/rock-2.svg");
  this.load.image("rock-3", "./img/rock-3.svg");
  this.load.image("meat-1", "./img/meat-1.svg");
  this.load.image("meat-2", "./img/meat-2.svg");
  this.load.image("meat-3", "./img/meat-3.svg");
  this.load.image("platform", "./img/platform.png");
  this.load.image("left-arrow", "./img/left-arrow.png");
  this.load.image("right-arrow", "./img/right-arrow.png");
  this.load.image("dinasaur", "./img/dinasaur.svg");
  this.load.audio("impact", "./sound/end.wav");
  this.load.audio("bonus", "./sound/ding.wav");
  this.load.audio("bg-music", "./sound/youtube-shawl-paul.mp3");
}

function create() {
  this.add.image(0,0,'background').setOrigin(0,0);
  this.add.image(0,0,'sky').setOrigin(0,0);
  this.add.image(0,262 ,'grass').setOrigin(0,0);
  gameState.moveLeft = false;
  gameState.moveRight = false;
  gameState.impactSound = this.sound.add("impact");
  gameState.bonusSound = this.sound.add("bonus");
  gameState.leftArrow = this.add.image(50, 180,'left-arrow');
  gameState.leftArrow.setDepth(10).setAlpha(0.3).setInteractive();
  gameState.rightArrow = this.add.image(590, 180,'right-arrow');
  gameState.rightArrow.setDepth(10).setAlpha(0.3).setInteractive();
  gameState.music = this.sound.add("bg-music"); // added background music
  const musicConfig = {
    mute: false,
    volume: 1,
    rate: 1,
    detune: 0,
    seek: 0,
    loop: true,
    delay: 0
  };
  gameState.music.play(musicConfig);

  gameState.cursors = this.input.keyboard.createCursorKeys();
  ///////////////

  const platforms = this.physics.add.staticGroup();

  platforms.create(320, 350, "platform").refreshBody();

  gameState.scoreText = this.add.text(10, 340, "Score: 0", {
    fontSize: "15px",
    fill: "#FFF",
	backgroundColor: "#000",
	padding: {
        left: 5,
        right: 5,
        top: 2,
        bottom: 2
	  }
  });

  gameState.player = this.physics.add.sprite(320, 300, "dinasaur");

  gameState.player.setCollideWorldBounds(true);

  this.physics.add.collider(gameState.player, platforms);

  const rocks = this.physics.add.group();

  const rockList = ["rock-1", "rock-2", "rock-3"];

  const rockGen = () => {
    const xCoord = Math.random() * 640;
    let randomRock = rockList[Math.floor(Math.random() * 3)];
    rocks.create(xCoord, 10, randomRock).setCircle(10, 5, 5); // setting collision radius (radius, offsetX, offsetY)
  };

  const rockGenLoop = this.time.addEvent({
    delay: 300,
    callback: rockGen,
    loop: true
  });

  const meat = this.physics.add.group();

  const meatList = ["meat-1", "meat-2", "meat-3"];

  const meatGen = () => {
    const xCoord = Math.random() * 640;
    let randomMeat = meatList[Math.floor(Math.random() * 3)];
    meat.create(xCoord, 10, randomMeat);
  };

  const meatGenLoop = this.time.addEvent({
    delay: 300,
    callback: meatGen,
    loop: true
  });

  this.physics.add.collider(rocks, platforms, function(rock) {
    rock.destroy();
  });

  this.physics.add.collider(meat, platforms, function(meatElem) {
    meatElem.destroy();
  });

  this.physics.add.collider(gameState.player, rocks, () => {
    gameState.impactSound.play();
    rockGenLoop.destroy();
    meatGenLoop.destroy();
    gameState.music.stop();
    this.physics.pause();

    this.add.text(205, 150, "Game Over!\n \nClick here or\nHit spacebar to Restart", {
      fontSize: "15px",
      fill: "#000",
      backgroundColor: "#FFF",
      padding: {
        left: 10,
        right: 10,
        top: 10,
        bottom: 10
	  },
	  align: 'center',
    });
    this.input.on('pointerdown', () => {
      this.scene.restart();
    })
    this.input.keyboard.on("keyup-SPACE", () => {
      this.scene.restart();
    });
    gameState.score = 0;
  });

  this.physics.add.collider(meat, gameState.player, function(playerElem, meatElem) {
    meatElem.destroy();
    gameState.bonusSound.play();
    gameState.score += 100;
    gameState.scoreText.setText(`Score: ${gameState.score}`);
  });

  gameState.leftArrow.on('pointerdown', function() {
    gameState.moveRight = false;
    gameState.moveLeft = true;
  });
  gameState.rightArrow.on('pointerdown', function() {
    gameState.moveLeft = false;
    gameState.moveRight = true;
  });
}

function update() {
  if (gameState.cursors.left.isDown) {
    gameState.moveRight = false;
    gameState.moveLeft = true;
  } else if (gameState.cursors.right.isDown) {
    gameState.moveLeft = false;
    gameState.moveRight = true;
  } else {
    gameState.player.setVelocityX(0);
  }

  if (gameState.moveLeft) {
    gameState.player.setFlipX(-1);
    gameState.player.setVelocityX(-200);
  } 
  if (gameState.moveRight) {
    gameState.player.setFlipX(0);
    gameState.player.setVelocityX(200);
  } 
//   if (gameState.score > 100) {
// 	console.log(this.rockGenLoop);
// 	// rockGenLoop.timer.timeScale = 2;
//   } else if (gameState.score > 5000) {
// 	this.rockGenLoop.delay = 250;
//   } else if (gameState.score > 7000) {
// 	this.rockGenLoop.delay = 200;
//   } else if (gameState.score > 10000) {
// 	this.rockGenLoop.delay =  150;
//   } else if (gameState.score > 15000) {
// 	this.rockGenLoop.delay =  100;
//   }
}

const config = {
  type: Phaser.AUTO,
  width: 640,
  height: 360,
  backgroundColor: "b9eaff",
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 100 },
      enableBody: true,
      debug: false
    }
  },
  scene: {
    preload,
    create,
    update
  }
};

const game = new Phaser.Game(config);

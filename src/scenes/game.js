/* eslint-disable no-unused-vars */
import { Scene } from "phaser";

export default class GameScene extends Scene {
  constructor() {
    super({
      key: "GameScene",
      active: false,
      physics: {
        default: "matter",
        matter: {
          debug: {
            boundsColor: 0xff0000,
            lineColor: 0xff0000,
            staticLineColor: 0xff0000,
          },
          gravity: { y: 0 },
          setBounds: {
            left: true,
            right: true,
            top: true,
            bottom: false,
          },
        },
      },
    });
  }
  preload() {
    this.load.image("ball", "assets/images/ball.png");
    this.load.image("paddle", "assets/images/paddle.png", 20, 50);
    this.load.image("lg_enemy", "assets/images/lg_enemy.png");
    this.load.image("sm_enemy", "assets/images/sm_enemy.png");
    this.load.image("md_enemy", "assets/images/md_enemy.png");
    this.load.image("bg", "assets/bg/bg.gif");
    this.load.audio("gameBgm", "assets/bgm/Game_music.mp3");
    // this.load.audio('imwaiting', 'assets/sfx/86951__tim-kahn__waiting-right-here.wav');
    this.load.audio("paddleHit", "assets/sfx/Ball_1.mp3");
    this.load.audio("engineSfx", "assets/sfx/Engine_sound.mp3");
    this.load.audio("hit1", "assets/sfx/Crash_2.mp3");
    this.load.audio("hit2", "assets/sfx/Crash_3.mp3");
    this.load.audio("hit3", "assets/sfx/Crash_4.mp3");
  }
  create() {
    let hit1, hit2, hit3;
    this.background = this.add.tileSprite(400, 300, 800, 600, "bg");

    this.engineSound = this.sound.add("engineSfx");
    this.engineSound.setVolume(0.5);

    this.gameMusic = this.sound.add("gameBgm");
    this.gameMusic.setVolume(0.6);
    // this.gameMusic.play()

    this.hit1 = this.sound.add("hit1");
    this.hit1.setVolume(0.3);

    this.hit2 = this.sound.add("hit2");
    this.hit2.setVolume(0.3);

    this.hit3 = this.sound.add("hit3");
    this.hit3.setVolume(0.3);

    this.paddleHit = this.sound.add("paddleHit");
    this.paddleHit.setVolume(0.3);

    // Создаем текстовый объект в верхнем левом углу экрана
    this.scoreText = this.add.text(16, 16, "", {
      fontFamily: "monospace",
      fontSize: "14px",
      fill: "#fff",
    });

    // Обновляем текстовый объект счетом из ScoreScene
    let scoreScene = this.scene.get("ScoreScene");
    this.scoreText.setText("Score: " + scoreScene.getScore());

    this.openingText = this.add.text(200, 200, "Hit SPACE to Start.", {
      fontFamily: "monospace",
      fontSize: "25px",
      fill: "#fff",
    });

    this.gameOverText = this.add.text(
      this.physics.world.bounds.width / 2,
      200,
      "Game Over!",
      {
        fontFamily: "monospace",
        fontSize: "25px",
        fill: "#fff",
        align: "center",
      }
    );

    this.playerWonText = this.add.text(
      this.physics.world.bounds.width / 2,
      this.physics.world.bounds.height / 2,
      "You won,\n good job!",
      {
        fontFamily: "monospace",
        fontSize: "25px",
        fill: "#fff",
        align: "center",
      }
    );

    this.playerWonText.setVisible(false);
    this.gameOverText.setVisible(false);
    this.openingText.setVisible(false);
    this.openingText.setOrigin(0.5);

    this.player = this.physics.add
      .image(
        150, // x position
        470, // y position
        "paddle" // key of image for the sprite
      )
      .setInteractive({ draggable: true })
      .setDrag(13000, 0)
      .setMaxVelocity(300, 400);

    this.player
      .on("dragstart", (pointer, dragX, dragY) => {
        // ...
        this.engineSound.play();
      })
      .on("drag", (pointer, dragX, dragY) => {
        this.player.setPosition(dragX, 450);
      })
      .on("dragend", (pointer, dragX, dragY, dropped) => {
        this.engineSound.stop();

        // ...
      });

    this.lgEnemies = this.physics.add.group({
      key: "lg_enemy",
      immovable: true,
      repeat: 4,
      setXY: {
        x: 95,
        y: 60,
        stepX: 35,
        stepY: 0,
      },
      setScale: { x: 0.4, y: 0.4 },
    });

    this.midEnemies = this.physics.add.group({
      key: "md_enemy",
      immovable: true,
      repeat: 3,
      setXY: {
        x: 75,
        y: 150,
        stepX: 35,
      },
      setScale: { x: 0.5, y: 0.2 },
    });

    this.smEnemies = this.physics.add.group({
      key: "sm_enemy",
      immovable: true,
      repeat: Math.random() * 15,
      setXY: {
        x: 125,
        y: 180,
        stepX: 0,
        stepY: 0,
      },
      setScale: { x: 0.4, y: 0.5 },
    })

    this.lgEnemies.children.entries.forEach((child) => {
      this.tweens.add({
        targets: child,
        ease: "Elastic.InOut",
        x: { start: child.x, to: Math.random() * 100 },
        duration: 1280,
        delay: Math.random() * 1000,
        yoyo: true,
        repeat: -1,
        onComplete: () => {},
      });
    });

    this.lgEnemies.children.entries.forEach((child) => {
      this.tweens.add({
        targets: child,
        y: { start: child.y, to: 100 },
        duration: 380,
        delay: Math.random() * 123,
        yoyo: true,
        repeat: -1,
        onComplete: () => {},
      });
    });

    this.smEnemies.children.entries.forEach((child) => {
      this.tweens.add({
        targets: child,
        ease: "Elastic.InOut",
        x: child.x + Math.random() * 100,
        y: child.y + Math.random() * 100,
        angle: Math.random() * 1000,
        duration: 680,
        delay: 70,
        yoyo: true,
        repeat: -1,
        onComplete: () => {},
      });
    });

    this.midEnemies.children.entries.forEach((child) => {
      this.tweens.add({
        targets: child,
        ease: "Bounce.InOut",
        x: child.x + Math.random() * 100,
        y: child.y + Math.random() * 100,
        angle: Math.random() * 1000,
        duration: 880,
        delay: 20,
        yoyo: true,
        repeat: -1,
        onComplete: () => {},
      });
    });

    this.ball = this.physics.add
      .sprite(
        165, // x position
        430, // y position
        "ball" // key of image for the sprite
      )
      .setFrictionY(0.8);

    this.startButton = this.add
      .text(
        this.physics.world.bounds.width / 2,
        this.physics.world.bounds.height / 2,
        "START",
        {
          fill: "#FFF",
          fontSize: "25px",
          align: "center",
          fontFamily: "monospace",
        }
      )
      .setOrigin(0.5)
      .setInteractive()
      .on("pointerdown", () => this.restartGame(this));

    this.ball.setBounce(1, 1);
    this.cursors = this.input.keyboard.createCursorKeys();

    this.player.setCollideWorldBounds(true);
    this.ball.setCollideWorldBounds(true);
    this.player.setImmovable(true);
    this.physics.world.checkCollision.down = false;

    this.physics.add.collider(
      this.ball,
      this.lgEnemies,
      this.hitBrick,
      null,
      this
    );
    this.physics.add.collider(
      this.ball,
      this.smEnemies,
      this.hitBrick,
      null,
      this
    );
    this.physics.add.collider(
      this.ball,
      this.midEnemies,
      this.hitBrick,
      null,
      this
    );
    this.physics.add.collider(
      this.ball,
      this.player,
      this.hitPlayer,
      null,
      this
    );
  }
  init() {
    console.log("game scene loaded");
  }
  update() {
    function stopTouch(pointer, player, evnt) {
      evnt.stopPropagation();
    }

    this.background.tilePositionY -= 0.5;

    const pointer = this.game.input.activePointer;

    let restartButton = this.add.text(
      this.physics.world.bounds.width / 2,
      this.physics.world.bounds.height / 2 + 100,
      "RESTART",
      {
        fill: "#FFF",
        fontSize: "25px",
        fontFamily: "monospace",
        align: "center",
      }
    );

    let nextButton = this.add.text(
      this.physics.world.bounds.width / 2,
      this.physics.world.bounds.height / 2 + 100,
      "NEXT",
      {
        fill: "#FFF",
        fontSize: "25px",
        fontFamily: "monospace",
        align: "center",
      }
    );

    nextButton
      .setVisible(false)
      .setOrigin(0.5)
      .setInteractive()
      .on("pointerdown", () => this.nextLevel(this));

    restartButton
      .setVisible(false)
      .setOrigin(0.5)
      .setInteractive()
      .on("pointerdown", () => this.restartGame(this));

    // Check if the ball left the scene i.e. game over
    if (this.isGameOver(this.physics.world)) {
      this.gameOverText.setOrigin();
      this.gameOverText.setVisible(true);
      restartButton.setOrigin(0.5);
      restartButton.setVisible(true);
      this.ball.disableBody(true, true);
      this.gameStarted = false;

      if (this.cursors.space.isDown) {
        this.restartGame(this);
      }
    } else if (this.isWon()) {
      // TODO: Show "You won!" message to the player
      this.playerWonText.setOrigin(0.5);
      this.playerWonText.setVisible(true);
      this.ball.disableBody(true, true);
      this.player.disableBody(true, true);
      this.gameStarted = false;
      // this.scene.stop()

      nextButton.setOrigin(0.5);
      nextButton.setVisible(true);
    } else {
      // TODO: Logic for regular game time
      const pointer = this.sys.game.input.activePointer;

      this.player.body.setVelocityX(0);
      this.player.setAccelerationX(0);
      this.engineSound.stop();

      if (this.cursors.left.isDown) {
        this.engineSound.play();
        this.player.body.setVelocityX(-350);
        this.player.setAccelerationX(-900);
      } else if (this.cursors.right.isDown) {
        this.player.body.setVelocityX(350);
        this.player.setAccelerationX(900);
        this.engineSound.play();
      }

      if (!this.gameStarted) {
        this.ball.setX(this.player.x);
        if (this.cursors.space.isDown || pointer.isDown) {
          this.gameStarted = true;
          this.ball.setVelocityY(-50);
          this.ball.setVelocityY(-350);
          this.openingText.setVisible(false);
          this.startButton.setVisible(false);
          const totalBricks =
            this.lgEnemies.countActive() +
            this.smEnemies.countActive() +
            this.midEnemies.countActive();
        }
      }
    }
  }

  isGameOver(world) {
    return this.ball.body.y > world.bounds.height;
  }

  isWon() {
    return (
      this.lgEnemies.countActive() +
        this.smEnemies.countActive() +
        this.midEnemies.countActive() ===
      0
    );
  }

  hitBrick(ball, brick) {
    let hits = [this.hit1, this.hit2, this.hit3];
    const random = Math.floor(Math.random() * hits.length);
    hits[random].play();

    let scoreScene = this.scene.get("ScoreScene");
    scoreScene.increaseScore(10);
    this.scoreText.setText("Score: " + scoreScene.getScore());

    if (ball.body.velocity.x === 0) {
      brick.disableBody(true, true);

      let randNum = Math.random();
      if (randNum >= 0.5) {
        ball.body.setVelocityX(17);
      } else {
        ball.body.setVelocityX(-17);
      }
    }

    this.tweens.add({
      targets: brick,
      ease: "Power1",
      scaleX: 0.1,
      scaleY: 0.1,
      angle: 0,
      duration: 80,
      delay: 0,
      onComplete: () => {
        brick.disableBody(true, true);
      },
    });

    this.tweens.add({
      targets: ball,
      yoyo: true,
      scaleX: 1.2,
      scaleY: 1.2,
      angle: -180,
      duration: 125,
      delay: 0,
      onComplete: () => {},
    });
  }

  hitPlayer(ball, player) {
    // Increase the velocity of the ball after it bounces
    this.paddleHit.play();
    ball.setVelocityY(ball.body.velocity.y - 5);

    this.tweens.add({
      targets: ball,
      yoyo: true,
      scaleX: 1.2,
      scaleY: 1.2,
      angle: 180,
      duration: 85,
      delay: 0,
      onComplete: () => {},
    });

    let diff = 0;
    let newXVelocity = Math.abs(ball.body.velocity.x) + 15;

    // If the ball is to the left of the player, ensure the X-velocity is negative
    if (ball.x < player.x) {
      // Если мяч слева от площадки
      diff = player.x - ball.x;
      ball.setVelocityX(-10 * diff);
    } else if (ball.x > player.x) {
      // Если мяч справа от площадки
      diff = ball.x - player.x;
      ball.setVelocityX(10 * diff);
    } else {
      // Мяч попал в центр площадки, добавить случайное отклонение
      ball.setVelocityX(2 + Math.random() * 8);
    }
  }

  restartGame(scene) {
    let scoreScene = this.scene.get("ScoreScene")
    scoreScene.resetScore()
    let soundScene = this.scene.get("SoundScene")

    soundScene.restartBgm()
    // this.gameMusic.stop()
    scene.registry.destroy(); // destroy registry
    scene.events.off(); // disable all active events
    scene.scene.start(); // restart current scene
  }

  nextLevel(scene) {
    scene.registry.destroy(); // destroy registry
    scene.events.off(); // disable all active events
    scene.scene.start(); // restart current scene
    this.ball.setVelocityY(-50);
    this.ball.setVelocityY(-350);
    this.openingText.setVisible(false);
    this.startButton.setVisible(false);
  }
}

/* eslint-disable no-unused-vars */
import { Scene } from "phaser"

 
export default class GameScene extends Scene {
  
  constructor() {
    super({ 
      key: "GameScene", 
      active: false,
      physics: {
        default: 'matter',
        matter: {
          debug: {
            boundsColor: 0xff0000,
            lineColor: 0xff0000,
            staticLineColor: 0xff0000
          },
          gravity: { y: 0 },
          setBounds: {
            left: true,
            right: true,
            top: true,
            bottom: false
          }
        }
      }
    })
  }
  preload() {
    this.load.image('ball', 'assets/images/ball.png')
    this.load.image('paddle', 'assets/images/paddle.png', 20, 50)
    this.load.image('lg_enemy', 'assets/images/lg_enemy.png')
    this.load.image('sm_enemy', 'assets/images/sm_enemy.png')
    this.load.image('md_enemy', 'assets/images/md_enemy.png')
    this.load.image('bg', 'assets/bg/bg.gif')
    this.load.audio('gameBgm', 'assets/bgm/Game_music.mp3')
    // this.load.audio('imwaiting', 'assets/sfx/86951__tim-kahn__waiting-right-here.wav');
    this.load.audio('paddleHit', 'assets/sfx/Ball_1.mp3')
    this.load.audio('engineSfx', 'assets/sfx/Engine_sound.mp3')
    this.load.audio('hit1', 'assets/sfx/Crash_2.mp3')
    this.load.audio('hit2', 'assets/sfx/Crash_3.mp3')
    this.load.audio('hit3', 'assets/sfx/Crash_4.mp3')
  }
  create() {
    let hit1, hit2, hit3
    this.background = this.add.tileSprite(400, 300, 800, 600, 'bg')
  
    this.engineSound = this.sound.add('engineSfx')
    this.engineSound.setVolume(.5)

    this.gameMusic = this.sound.add('gameBgm')
    this.gameMusic.setVolume(.6)
    this.gameMusic.play()
    
    // levelStartPhrase = this.sound.add('imwaiting')
    
    this.hit1 = this.sound.add('hit1')
    this.hit1.setVolume(.3)
  
    this.hit2 = this.sound.add('hit2')
    this.hit2.setVolume(.3)
    
    this.hit3 = this.sound.add('hit3')
    this.hit3.setVolume(.3)
    
  
    this.paddleHit = this.sound.add('paddleHit')
    this.paddleHit.setVolume(.3)
  
    this.openingText = this.add.text(
      200,
      200,
      'Hit SPACE to Start.',
      {
        fontFamily: 'monospace',
        fontSize: '25px',
        fill: '#fff'
      }
    )
  
    this.gameOverText = this.add.text(
      200,
      200,
      'Game Over!',
      {
        fontFamily: 'monospace',
        fontSize: '25px',
        fill: '#fff',
        align: 'center'
      }
    )
  
    this.playerWonText = this.add.text(
      this.physics.world.bounds.width / 2,
      this.physics.world.bounds.height / 2,
      'You won,\n good job!',
      {
        fontFamily: 'monospace',
        fontSize: '25px',
        fill: '#fff',
        align: 'center'
      },
    )
  
    this.playerWonText.setVisible(false)
    this.gameOverText.setVisible(false)
    this.openingText.setVisible(false)
    this.openingText.setOrigin(0.5)
  
    this.player = this.physics.add.image(
      150, // x position
      450, // y position
      'paddle', // key of image for the sprite
    ).setInteractive({ draggable: true })
      .setDrag(13000, 0)
      .setMaxVelocity(300, 400)


  
    this.player
      .on('dragstart', (pointer, dragX, dragY) => {
        // ...
        this.engineSound.play()

      })
      .on('drag', (pointer, dragX, dragY) => {
        this.player.setPosition(dragX, 450)

      })
      .on('dragend', (pointer, dragX, dragY, dropped) => {
        this.engineSound.stop()

        // ...
      })
  
  
    this.violetBricks = this.physics.add.group({
      key: 'lg_enemy',
      immovable: true,
      repeat: 2,
      setXY: {
        x: 65,
        y: 60,
        stepX: 85,
        stepY: 0,
      },
      setScale: { x: .6, y: .6}
    })
  
  
    this.redBricks = this.physics.add.group({
      key: 'md_enemy',
      immovable: true,
      repeat: 3,
      setXY: {
        x: 45,
        y: 150,
        stepX: 85
      },
      setScale: { x: .8, y: .7}
  
    })
  
    this.yellowBricks = this.physics.add.group({
      key: 'sm_enemy',
      immovable: true,
      repeat: 3,
      setXY: {
        x: 65,
        y: 220,
        stepX: 65
      },
      setScale: { x: .9, y: 1}
  
    })
  
    this.ball = this.physics.add.sprite(
      165, // x position
      430, // y position
      'ball', // key of image for the sprite
    ).setFrictionY(.8)
  
    this.startButton = this.add.text(
      this.physics.world.bounds.width / 2,
      this.physics.world.bounds.height / 2,
      'START',
      { fill: '#FFF', fontSize: '25px', align: 'center', fontFamily: 'monospace', }
    )
      .setOrigin(0.5)
      .setInteractive()
      .on('pointerdown', () => this.restartGame(this) )
  
    this.ball.setBounce(1, 1)
    this.cursors = this.input.keyboard.createCursorKeys()
  
    this.player.setCollideWorldBounds(true)
    this.ball.setCollideWorldBounds(true)
    this.player.setImmovable(true)
    this.physics.world.checkCollision.down = false
  
    this.physics.add.collider(this.ball, this.violetBricks, this.hitBrick, null, this)
    this.physics.add.collider(this.ball, this.yellowBricks, this.hitBrick, null, this)
    this.physics.add.collider(this.ball, this.redBricks, this.hitBrick, null, this)
    this.physics.add.collider(this.ball, this.player, this.hitPlayer, null, this)
  }
  init() {
    console.log('game scene loaded')
  }
  update() {
    function stopTouch (pointer, player, evnt) {
      evnt.stopPropagation()
    }
    this.background.tilePositionY += 0.5
    const pointer = this.game.input.activePointer
    let restartButton = this.add.text(
      this.physics.world.bounds.width / 2 ,
      this.physics.world.bounds.height / 2 + 100,
      'RESTART',
      { fill: '#FFF', fontSize: '25px', fontFamily: 'monospace', align: 'center' }
    )

    restartButton.setVisible(false)
      .setOrigin(0.5)
      .setInteractive()
      .on('pointerdown', () => this.restartGame(this) )
  
    // Check if the ball left the scene i.e. game over
    if (this.isGameOver(this.physics.world)) {
      this.gameOverText.setOrigin()
      this.gameOverText.setVisible(true)
      restartButton.setOrigin(0.5)
      restartButton.setVisible(true)
      this.ball.disableBody(true, true)
      this.gameStarted=false
      
      
      if (this.cursors.space.isDown) {
        this.restartGame(this)
      }
    } else if (this.isWon()) {
      // TODO: Show "You won!" message to the player
      this.playerWonText.setOrigin(0.5)
      this.playerWonText.setVisible(true)
      this.ball.disableBody(true, true)
      this.player.disableBody(true, true)
      this.gameStarted=false
      this.scene.stop()
      this.scene.launch('GameBossScene')
      // restartButton.setOrigin(0.5)
      // restartButton.setVisible(true)

  
    } else {
      // TODO: Logic for regular game time
      const pointer = this.sys.game.input.activePointer
    
      this.player.body.setVelocityX(0)
      this.player.setAccelerationX(0)
      this.engineSound.stop()

    
      if (this.cursors.left.isDown) {
        this.engineSound.play()
        this.player.body.setVelocityX(-350)
        this.player.setAccelerationX(-900)
      } else if (this.cursors.right.isDown) {
        this.player.body.setVelocityX(350)
        this.player.setAccelerationX(900)
        this.engineSound.play()
      }
    
      if (!this.gameStarted) {
        this.ball.setX(this.player.x)
        if (this.cursors.space.isDown || pointer.isDown) {
          this.gameStarted = true
          this.ball.setVelocityY(-50)
          // levelStartPhrase.play()
          this.ball.setVelocityY(-350)
          this.openingText.setVisible(false)
          this.startButton.setVisible(false)
          const totalBricks = this.violetBricks.countActive() + this.yellowBricks.countActive() + this.redBricks.countActive()
        }
      }
    }
  }
  
  
  isGameOver(world) {
    return this.ball.body.y > world.bounds.height
  }
  
  isWon() {
    return this.violetBricks.countActive() + this.yellowBricks.countActive() + this.redBricks.countActive() === 0
  }
  
  hitBrick(ball, brick) {
    let hits = [this.hit1, this.hit2, this.hit3]
    const random = Math.floor(Math.random() * hits.length)
    hits[random].play()
  
    if (ball.body.velocity.x === 0) {
      brick.disableBody(true, true)

      let randNum = Math.random()
      if (randNum >= 0.5) {
        ball.body.setVelocityX(17)
      } else {
        ball.body.setVelocityX(-17)

      }
    }
  
    this.tweens.add({
      targets: brick,
      ease: 'Power1',
      scaleX: .10,
      scaleY: .10,
      angle: 0,
      duration: 80,
      delay: 0,
      onComplete: () => { 
        brick.disableBody(true, true)

      }
    })

    this.tweens.add({
      targets: ball,
      yoyo: true,
      scaleX: 1.2,
      scaleY: 1.2,
      angle: -180,
      duration: 125,
      delay: 0,
      onComplete: () => { 
      }
    })
   
  }
  
  hitPlayer(ball, player) {
    // Increase the velocity of the ball after it bounces
    this.paddleHit.play()
    ball.setVelocityY(ball.body.velocity.y - 5)
  
    this.tweens.add({
      targets: ball,
      yoyo: true,
      scaleX: 1.2,
      scaleY: 1.2,
      angle: 180,
      duration: 85,
      delay: 0,
      onComplete: () => { 
  
      }
    })
  
    let newXVelocity = Math.abs(ball.body.velocity.x) + 55
    // If the ball is to the left of the player, ensure the X-velocity is negative
    if (ball.x < player.x) {
      ball.setVelocityX(-newXVelocity)
    } else {
      ball.setVelocityX(newXVelocity)
    }
  }
  
  restartGame(scene) {
    this.gameMusic.stop()
    scene.registry.destroy() // destroy registry
    scene.events.off() // disable all active events
    scene.scene.start() // restart current scene
  }
}
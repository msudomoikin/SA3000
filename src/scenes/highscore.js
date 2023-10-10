import { Scene } from "phaser"

 
export default class HighscoreScene extends Scene {

  constructor() {
    super({ key: "HighscoreScene", active: false })
  }
  preload() {
    this.load.image('bg', 'assets/bg/bg.gif')
    this.load.audio('titleBgm', 'assets/bgm/Menu_music.mp3')
    this.load.audio('begin', 'assets/sfx/Menu_Play.mp3')
    this.load.image('title', 'assets/images/title.png')
  }
  create() {
    this.start = false

    this.titleMusic = this.sound.add('titleBgm')
    this.beginSound = this.sound.add('begin')
    this.beginSound.setVolume(1.5)

    this.titleMusic.setVolume(.6)
    this.titleMusic.loop = true
    this.titleMusic.play()

    this.background = this.add.tileSprite(400, 300, 800, 600, 'bg')
    
    this.openingText = this.add.text(
      this.physics.world.bounds.width / 2,
      350,
      'HERE WILL BE TOP10 SCORES',
      {
        fontFamily: 'monospace',
        fontSize: '25px',
        fill: '#fff',
        align: 'center'
      }
    ).setOrigin(0.5)
    


    this.beginButton = this.add.text(
      this.physics.world.bounds.width / 2,
      400,
      'BACK',
      { fill: '#FFF', fontSize: '25px', align: 'center', fontFamily: 'monospace', }
    )
      .setOrigin(0.5)
      .setInteractive()
      .setVisible(true)
      .on('pointerdown', () => {this.scene.launch('TitleScene'), this.scene.stop(), this.beginSound.play(), this.titleMusic.stop()}
      )

  }
  init() {
    console.log('title scene loaded')

  }
  update() {
    if (this.start) {
      this.background.tilePositionY += 0.5
    }
  }
}
import { Scene } from "phaser"

export default class SoundScene extends Scene {
  constructor() {
    super({ key: "SoundScene", active: true })
  }
  preload() {
    this.load.audio("titleBgm", "assets/bgm/Menu_music.mp3")
    this.load.audio("begin", "assets/sfx/Menu_Play.mp3")
    this.load.audio('gameBgm', 'assets/bgm/Game_music.mp3')
    this.load.audio('gameBgm', 'assets/bgm/Game_music.mp3')

  }
  create() {
    this.titleMusic = this.sound.add("titleBgm")
    this.beginSound = this.sound.add("begin")
    this.beginSound.setVolume(1.5)
    this.titleMusic.setVolume(0.6)
    this.titleMusic.loop = true
    this.titleMusic.play()
    this.gameMusic = this.sound.add('gameBgm')
  }
  init() {
    console.log("sound scene loaded")
  }
  update() {
  }
  playBgm() {
    console.log('sound scene plybgm started')
    this.titleMusic.stop()
    this.gameMusic.setVolume(.6)
    this.gameMusic.play()
  }
  stopTitleMusic() {
    this.titleMusic.stop()
  }
  restartBgm() {
    console.log('sound scene restartBgm started')
    this.gameMusic.stop()
    this.gameMusic.setVolume(.6)
    this.gameMusic.play()
  }
}

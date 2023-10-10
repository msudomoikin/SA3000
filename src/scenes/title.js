import { Scene } from "phaser"

export default class TitleScene extends Scene {
  constructor() {
    super({ key: "TitleScene", active: true })
  }
  preload() {
    this.load.image("bg", "assets/bg/bg.gif")
    this.load.audio("begin", "assets/sfx/Menu_Play.mp3")
    this.load.image("title", "assets/images/title.png")
  }
  create() {
    this.start = false

    this.beginSound = this.sound.add("begin")
    this.beginSound.setVolume(1.5)


    this.background = this.add.tileSprite(400, 300, 800, 600, "bg")

    this.openingText = this.add
      .text(
        this.physics.world.bounds.width / 2,
        350,
        "TAP ANYWHERE\nTO START",
        {
          fontFamily: "monospace",
          fontSize: "25px",
          fill: "#fff",
          align: "center",
        }
      )
      .setOrigin(0.5)

    this.input.once("pointerdown", () => {
      this.openingText.setVisible(false)
      this.beginButton.setVisible(true)
      this.highscoreButton.setVisible(true)
      this.start = true
    })

    this.titleImage = this.physics.add.image(
      this.physics.world.bounds.width / 2, // x position
      200, // y position
      "title" // key of image for the sprite
    )

    this.beginButton = this.add
      .text(this.physics.world.bounds.width / 2, 350, "START", {
        fill: "#FFF",
        fontSize: "25px",
        align: "center",
        fontFamily: "monospace",
      })
      .setOrigin(0.5)
      .setInteractive()
      .setVisible(false)
      .on("pointerdown", () => {
        this.scene.launch("GameScene"),
        this.scene.stop(),
        this.beginSound.play()
      })

    this.highscoreButton = this.add
      .text(this.physics.world.bounds.width / 2, 400, "HIGHSCORES", {
        fill: "#FFF",
        fontSize: "25px",
        align: "center",
        fontFamily: "monospace",
      })
      .setOrigin(0.5)
      .setInteractive()
      .setVisible(false)
      .on("pointerdown", () => {
        this.scene.launch("HighscoreScene"),
        this.scene.stop(),
        this.beginSound.play(),
        this.titleMusic.stop()
      })
  }
  init() {
    console.log("title scene loaded")
  }
  update() {
    if (this.start) {
      this.background.tilePositionY += 0.5
    }
  }
}

import Phaser from "phaser"
import TitleScene from "./scenes/title"
import GameScene from "./scenes/game"
import GameBossScene from "./scenes/gameBoss"
import HighscoreScene from "./scenes/highscore"
import SoundScene from "./scenes/sound"
import ScoreScene from "./scenes/score"


 
document.addEventListener("DOMContentLoaded", () => {
  let game = new Phaser.Game({
    type: Phaser.AUTO,
    width: 300,
    heigth: 500,
    parent: "game",
    scale: {
      mode: Phaser.Scale.RESIZE,
      autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: [
      TitleScene, GameScene, GameBossScene, HighscoreScene, SoundScene, ScoreScene,
    ],
    physics: {
      default: 'arcade',
      arcade: {
        gravity: false,
        debug: true,
      },
    }
  })
  game.scene.start(TitleScene)
})
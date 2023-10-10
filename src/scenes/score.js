import { Scene } from "phaser"

class ScoreScene extends Scene {
  constructor() {
    super({ key: "ScoreScene" })
    this.score = 0
  }

  create() {
    // Инициализация счета
    this.score = 0
  }

  increaseScore(points) {
    this.score += points
  }

  getScore() {
    return this.score
  }
  resetScore() {
    this.score = 0
  }
}

export default ScoreScene

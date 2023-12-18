import { Scene } from "phaser"

class ScoreScene extends Scene {
  constructor() {
    super({ key: "ScoreScene" })
    this.score = 0
    this.enemiesKilled = 0
  }

  create() {
    // Инициализация счета
    this.score = 0
    this.enemiesKilled = 0

  }

  increaseScore(points) {
    this.score += points
  }

  countKill() {
    this.enemiesKilled += 1
  }

  getScore() {
    return this.score
  }
  getKilled() {
    return this.enemiesKilled
  }
  resetScore() {
    this.score = 0
    this.enemiesKilled = 0
  }
}

export default ScoreScene

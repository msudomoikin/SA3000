import Player from "./bossPlayer"
import Phaser from "phaser"

/**
 * A class that extends Phaser.Scene and wraps up the core logic for the platformer level.
 */
export default class GameBossScene extends Phaser.Scene {
  constructor() {
    super({ 
      key: "GameBossScene", 
      active: false,
      physics: {
        default: 'arcade',
        arcade: { 
          gravity: { y: 1000 }
        }
      }
    })
  }
  init() {
  }
  preload() {
    this.load.audio('jumpSound', 'assets/sfx/Ball_1.mp3')

    this.load.spritesheet(
      "player",
      "assets/spritesheets/0x72-industrial-player-32px-extruded.png",
      {
        frameWidth: 32,
        frameHeight: 32,
        margin: 1,
        spacing: 2,
      }
    )
    this.load.audio('gameBossMusic', 'assets/bgm/Game_music.mp3')
    this.load.image("spike", "assets/images/0x72-industrial-spike.png")
    this.load.image(
      "tiles",
      "assets/tilesets/0x72-industrial-tileset-32px-extruded.png"
    )
    this.load.tilemapTiledJSON("map", "assets/tilemaps/platformer2.json")
  }

  create() {
    
    // this is to finish level

    // this.stuffLayer.setTileIndexCallback(TILES.STAIRS, () => {
    //   this.stuffLayer.setTileIndexCallback(TILES.STAIRS, null)
    //   this.hasPlayerReachedStairs = true
    //   this.player.freeze()
    //   const cam = this.cameras.main
    //   cam.fade(250, 0, 0, 0)
    //   cam.once("camerafadeoutcomplete", () => {
    //     this.player.destroy()
    //     this.scene.restart()
    //   })
    // })


    // this is for items pickup
    
    // private initChests(): void {
    //   const chestPoints = gameObjectsToObjectPoints(
    //     this.map.filterObjects('Chests', obj => obj.name === 'ChestPoint'),
    //   );
    //   this.chests = chestPoints.map(chestPoint =>
    //     this.physics.add.sprite(chestPoint.x, chestPoint.y, 'tiles_spr', 595).setScale(1.5),
    //   );
    //   this.chests.forEach(chest => {
    //     this.physics.add.overlap(this.player, chest, (obj1, obj2) => {
    //       obj2.destroy();
    //       this.cameras.main.flash();
    //     });
    //   });
    // }
    
    this.jumpSound = this.sound.add('jumpSound')
    this.jumpSound.setVolume(.3)

    this.isPlayerDead = false

    this.map = this.make.tilemap({ key: "map" })
    this.tiles = this.map.addTilesetImage(
      "0x72-industrial-tileset-32px-extruded",
      "tiles"
    )

    this.map.createLayer("Background", this.tiles)
    this.groundLayer = this.map.createLayer("Ground", this.tiles)
    this.map.createLayer("Foreground", this.tiles)

    this.finishLayer = this.map.createLayer("Finish", this.tiles)
    // this.finishLayer.setTileIndexCallback(2, () => {console.log('finished')})


    //init finish point
    const finishPoint = this.map.findObject(
      "Objects",
      (obj) => obj.name === "Finish Point"
    )
    console.log(finishPoint)

    // Instantiate a player instance at the location of the "Spawn Point" object in the Tiled map
    const spawnPoint = this.map.findObject(
      "Objects",
      (obj) => obj.name === "Spawn Point"
    )
    this.player = new Player(this, spawnPoint.x, spawnPoint.y)

    // Collide the player against the ground layer - here we are grabbing the sprite property from
    // the player (since the Player class is not a Phaser.Sprite).
    this.groundLayer.setCollisionByProperty({ collides: true })
    this.physics.world.addCollider(this.player.sprite, this.groundLayer)

    // The map contains a row of spikes. The spike only take a small sliver of the tile graphic, so
    // if we let arcade physics treat the spikes as colliding, the player will collide while the
    // sprite is hovering over the spikes. We'll remove the spike tiles and turn them into sprites
    // so that we give them a more fitting hitbox.
    this.spikeGroup = this.physics.add.staticGroup()
    this.groundLayer.forEachTile((tile) => {
      if (tile.index === 77) {
        const spike = this.spikeGroup.create(
          tile.getCenterX(),
          tile.getCenterY(),
          "spike"
        )

        // The map has spikes rotated in Tiled (z key), so parse out that angle to the correct body
        // placement
        spike.rotation = tile.rotation
        if (spike.angle === 0) spike.body.setSize(32, 6).setOffset(0, 26)
        else if (spike.angle === -90)
          spike.body.setSize(6, 32).setOffset(26, 0)
        else if (spike.angle === 90) spike.body.setSize(6, 32).setOffset(0, 0)

        this.groundLayer.removeTileAt(tile.x, tile.y)
      }
    })

    this.cameras.main.startFollow(this.player.sprite)
    this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels)


    // Help text that has a "fixed" position on the screen
    this.add
      .text(16, 16, "Arrow/WASD to move & jump", {
        font: "18px monospace",
        fill: "#000000",
        padding: { x: 20, y: 10 },
        backgroundColor: "#ffffff",
      })
      .setScrollFactor(0)
  }

  update() {
    if (this.isPlayerDead) return

    this.player.update()

    if (
      this.player.sprite.y > this.groundLayer.height ||
      this.physics.world.overlap(this.player.sprite, this.spikeGroup)
    ) {
      // Flag that the player is dead so that we can stop update from running in the future
      this.isPlayerDead = true

      const cam = this.cameras.main
      cam.shake(100, 0.05)
      cam.fade(250, 0, 0, 0)

      // Freeze the player to leave them on screen while fading but remove the marker immediately
      this.player.freeze()

      cam.once("camerafadeoutcomplete", () => {
        this.player.destroy()
        this.scene.restart()
      })
    }
  }
}

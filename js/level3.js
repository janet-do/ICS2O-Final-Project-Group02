/* global Phaser */

/*
 * This class is the Game Scene.
 **/
class GameScene3 extends Phaser.Scene {
  constructor() {
    super({ key: "gameScene3" })
    this.player = null
    this.score = 0
    this.lives = 3 // Initialize lives to 3
    this.scoreText = null
    this.livesText = null // Text object for displaying lives
    this.scoreTextStyle = {
      font: "65px Arial",
      fill: "#ffffff",
      align: "center",
    }
    this.gameOverTextStyle = {
      font: "65px Arial",
      fill: "#ff0000",
      align: "center",
    }
  }

  init(data) {
    this.cameras.main.setBackgroundColor("#0x5f6e7a")
    this.score = data.score || 0 // Retrieve score from the previous level or set it to 0 if not available
  }

  preload() {
    console.log("GameScene3")

    // images
    this.load.image("valentineBackground", "assets/valentinestart.png")
    this.load.image("valentineplayer", "assets/pinkcar.png")
    this.load.image("valentinecandy", "assets/heart.png")
    this.load.image("valentinecar", "assets/arrow.png")

    // sounds
    this.load.audio("collect", "assets/collect.mp3")
    this.load.audio("crash", "assets/hit.mp3")
  }

  create(data) {
    this.background = this.add.image(0, 0, "valentineBackground").setScale(2.0)
    this.background.setOrigin(0, 0)

    this.scoreText = this.add.text(
      10,
       10,
      "Score: " + this.score.toString(),
      this.scoreTextStyle
    )

    // Create lives text
    this.lives = 3
    this.livesText = this.add.text(
      this.cameras.main.width - 10,
      10,
      "Lives: " + this.lives.toString(),
      this.scoreTextStyle
    )
    this.livesText.setOrigin(1, 0)

    this.player = this.physics.add.sprite(1920 / 2, 1080 - 100, "valentineplayer")

    // create a group for candies and arrows
    this.candies = this.add.group()
    this.arrows = this.add.group() // Create a group for arrows

    this.createCandy()

    this.time.addEvent({
      delay: 3000,
      loop: true,
      callback: this.createArrow,
      callbackScope: this,
    })

    this.time.addEvent({ // Create arrows
      delay: 2000,
      loop: true,
      callback: this.createArrow,
      callbackScope: this,
    })

    // Collision between player and candy
    this.physics.add.collider(
      this.player,
      this.candies,
      (playerCollide, candyCollide) => {
        candyCollide.destroy()
        this.sound.play("collect")
        this.score++
        this.scoreText.setText("Score: " + this.score.toString())

        this.createCandy() // Create a new candy when one is collected
      }
    )

    // Collision between player and arrow
    this.physics.add.collider(
      this.player,
      this.arrows,
      (playerCollide, arrowCollide) => {
        arrowCollide.destroy()
        playerCollide.setTint(0xff0000)
        this.sound.play("crash")
        this.lives--
        this.livesText.setText("Lives: " + this.lives.toString());

        if (this.lives <= 0) {
          this.gameOver()
        } else {
          this.time.delayedCall(1000, () => {
            playerCollide.clearTint()
            if (this.lives > 0) {
              // Continue with player movement
            }
          })
        }
      }
    )

    // Create the level text
    this.levelText = this.add.text(
      this.cameras.main.width / 2,
      this.cameras.main.height / 2,
      "This is the final level, keep going as much as you can and beat your high score.",
      {
        font: "32px Arial",
        fill: "#ffffff",
        align: "center"
      }
    )
    this.levelText.setOrigin(0.5)
    this.levelText.setVisible(false)
  }

  update(time, delta) {
    const keyAObj = this.input.keyboard.addKey("A")
    const keyDObj = this.input.keyboard.addKey("D")
    const keyWObj = this.input.keyboard.addKey("W")
    const keySObj = this.input.keyboard.addKey("S")

    const moveSpeed = 10
    const rotationSpeed = Math.PI / 180 * 5

    if (keyAObj.isDown) {
      this.player.x -= moveSpeed // Move left
      this.player.rotation = -rotationSpeed // Rotate left
    } else if (keyDObj.isDown) {
      this.player.x += moveSpeed // Move right
      this.player.rotation = rotationSpeed // Rotate right
    } else {
      this.player.rotation = 0 // Reset rotation if no movement
    }

    if (keyWObj.isDown) {
      this.player.y -= moveSpeed // Move up
    } else if (keySObj.isDown) {
      this.player.y += moveSpeed // Move down
    }

    if (this.score >= 3 && !this.levelText.visible) {
      this.levelText.setVisible(true)
    }

    // Limit the player's bounds to the game screen
    const minX = this.player.width / 2
    const maxX = this.cameras.main.width - this.player.width / 2
    this.player.x = Phaser.Math.Clamp(this.player.x, minX, maxX)
    const minY = this.player.height / 2
    const maxY = this.cameras.main.height - this.player.height / 2
    this.player.y = Phaser.Math.Clamp(this.player.y, minY, maxY)
  }

  createCandy() {
    const candyXLocation = Phaser.Math.Between(
      100,
      this.cameras.main.width - 100
    )
    const candyYLocation = Phaser.Math.Between(
      100,
      this.cameras.main.height - 100
    )
    const candy = this.physics.add.sprite(
      candyXLocation,
      candyYLocation,
      "valentinecandy"
    )

    candy.setCollideWorldBounds(true)
    candy.setBounce(1, 1)

    this.candies.add(candy)
  }

  createArrow() {
    const arrowXLocation = Phaser.Math.Between(
      100,
      this.cameras.main.width - 100
    )
    const arrowYLocation = 0
    const arrow = this.physics.add.sprite(
      arrowXLocation,
      arrowYLocation,
      "valentinecar"
    )

    arrow.setCollideWorldBounds(true)
    arrow.setBounce(1, 1)

    arrow.setVelocity(0, Phaser.Math.Between(300, 500)) // Set the vertical velocity of the arrow

    this.arrows.add(arrow)
  }

  gameOver() {
    // Save the score in localStorage
    localStorage.setItem("score", this.score.toString())

    this.physics.pause()
    this.gameOverTextStyle = this.add
    .text(1920 / 2, 1080 / 2, "GAME OVER click to restart", this.gameOverTextStyle)
    .setOrigin(0.5)
  this.gameOverTextStyle.setInteractive({ useHandCursor: true })
  this.gameOverTextStyle.on("pointerdown", () => this.scene.start("gameScene"))
  }
}

export default GameScene3

/* global Phaser */

/*
 * This class is the Game Scene.
 **/
class GameScene2 extends Phaser.Scene {
  constructor() {
    super({ key: "gameScene2" });
    this.player = null;
    this.score = 0;
    this.lives = 3; // Initialize lives to 3
    this.scoreText = null;
    this.livesText = null; // Text object for displaying lives
    this.scoreTextStyle = {
      font: "65px Arial",
      fill: "#6aba5f",
      align: "center",
    };
    this.gameOverTextStyle = {
      font: "65px Arial",
      fill: "#ff0000",
      align: "center",
    };
  }

  init(data) {
    this.cameras.main.setBackgroundColor("#0x5f6e7a");
    this.score = data.score || 0; // Retrieve score from the previous level or set it to 0 if not available
  }
  

  preload() {
    console.log("GameScene2");

    // images
    this.load.image("christmasBackground", "assets/christmasBackground.png");
    this.load.image("christmasPlayer", "assets/christmascar.png");
    this.load.image("christmasCandy", "assets/candycane.png");
    this.load.image("christmasCar", "assets/reindeer.png");
    this.load.image("nextLevel2", "assets/levelswitch2.png");

    // sounds
    this.load.audio("collect", "assets/collect.mp3");
    this.load.audio("crash", "assets/hit.mp3");
  }

  create(data) {
    this.background = this.add.image(0, 0, "christmasBackground").setScale(2.0);
    this.background.setOrigin(0, 0);

    this.scoreText = this.add.text(
      10,
      10,
      "Score: " + this.score.toString(),
      this.scoreTextStyle
    );

    // Create lives text
    this.lives = 3;
    this.livesText = this.add.text(
      this.cameras.main.width - 10,
      10,
      "Lives: " + this.lives.toString(),
      this.scoreTextStyle
    );
    this.livesText.setOrigin(1, 0);

    this.player = this.physics.add.sprite(1920 / 2, 1080 - 100, "christmasPlayer");

    // create a group for cars
    this.carGroup = this.add.group();
    this.createCar(1);
    this.createCar(2);
    this.createCar(3);
    this.createCar(4);
    this.createCar(5);
    this.createCar(6);

    // create a group for candies
    this.candyGroup = this.physics.add.group();
    this.spawnCandy();
    this.spawnCandy();
    this.spawnCandy();

    // Collision between player and candy
    this.physics.add.overlap(
      this.player,
      this.candyGroup,
      (playerCollide, candyCollide) => {
        candyCollide.destroy();
        this.sound.play("collect");
        this.score += 1;
        this.scoreText.setText("Score: " + this.score.toString());
        this.spawnCandy();

        // Check if the player reached 5 points
        if (this.score >= 1) {
          this.createNextLevelButton();
        }
      }
    );

    // Collision between player and enemy car
    this.physics.add.collider(
      this.player,
      this.carGroup,
      (playerCollide, carCollide) => {
        carCollide.destroy();
        playerCollide.setTint(0xff0000);
        this.sound.play("crash");
        this.lives--;
        this.livesText.setText("Lives: " + this.lives.toString());

        if (this.lives <= 0) {
          this.gameOver();
        } else {
          this.time.delayedCall(1000, () => {
            playerCollide.clearTint();
            if (this.lives > 0) {
              // Continue with player movement
            }
          });
        }
      }
    );
  }

  update(time, delta) {
    const keyAObj = this.input.keyboard.addKey("A");
    const keyDObj = this.input.keyboard.addKey("D");
    const keyWObj = this.input.keyboard.addKey("W");
    const keySObj = this.input.keyboard.addKey("S");

    const rotationSpeed = 0.08; // Adjust this value to control the rotation speed
    const moveSpeed = 5; // Adjust this value to control the movement speed

    if (keyAObj.isDown) {
      this.player.x -= moveSpeed; // Move left
      this.player.rotation = -rotationSpeed; // Rotate left slightly
    } else if (keyDObj.isDown) {
      this.player.x += moveSpeed; // Move right
      this.player.rotation = rotationSpeed; // Rotate right slightly
    } else {
      this.player.rotation = 0; // Reset rotation when no rotation keys are pressed
    }

    if (keyWObj.isDown) {
      this.player.y -= moveSpeed; // Move up
    } else if (keySObj.isDown) {
      this.player.y += moveSpeed; // Move down
    }

    // Limit the players bounds to the game screen
    const minX = this.player.width / 2;
    const maxX = this.cameras.main.width - this.player.width / 2;
    this.player.x = Phaser.Math.Clamp(this.player.x, minX, maxX);
    const minY = this.player.height / 2;
    const maxY = this.cameras.main.height - this.player.height / 2;
    this.player.y = Phaser.Math.Clamp(this.player.y, minY, maxY);

    // Update car movement and check for screen boundaries
    this.carGroup.getChildren().forEach((car) => {
      // Move the car horizontally based on its moveSpeed property
      car.x += car.moveSpeed;

      // Check if the car has reached the edges of the screen
      if (car.x < 0 || car.x > this.cameras.main.width) {
        // Reverse the car's moveSpeed to change its direction
        car.moveSpeed *= -1;

        // Move the car back inside the screen bounds
        car.x = Phaser.Math.Clamp(car.x, 0, this.cameras.main.width);
      }
    });
  }

  createCar(carType) {
    const centerX = this.cameras.main.width / 2;
    const centerY = this.cameras.main.height / 2;
    const minDistance = 300; // Minimum distance between cars
    const playerSafeDistance = 200; // Minimum distance between the player and a spawned car

    let carXLocation, carYLocation;
    let isOverlapping = true;

    // Keep generating random coordinates until a non-overlapping position is found
    while (isOverlapping) {
      carXLocation = Phaser.Math.FloatBetween(centerX - 400, centerX + 400);
      carYLocation = Phaser.Math.FloatBetween(centerY - 400, centerY + 400);

      // Calculate the distance between the car and the player
      const distanceToPlayer = Phaser.Math.Distance.Between(
        this.player.x,
        this.player.y,
        carXLocation,
        carYLocation
      );

      // Check if the car is too close to the player
      if (distanceToPlayer > playerSafeDistance) {
        // Check if the car overlaps with other cars
        isOverlapping = this.checkCarOverlap(carXLocation, carYLocation, minDistance);
      }
    }

    const car = this.physics.add.sprite(carXLocation, carYLocation, "christmasCar");
    car.moveSpeed = Phaser.Math.FloatBetween(2, 6); // Set a random move speed for the car

    car.setCollideWorldBounds(true);
    car.setBounce(1, 1);
    car.setImmovable(true);

    this.carGroup.add(car);
  }

  checkCarOverlap(x, y, minDistance) {
    const cars = this.carGroup.getChildren();

    for (let counter = 0; counter < cars.length; counter++) {
      const car = cars[counter];
      const distance = Phaser.Math.Distance.Between(x, y, car.x, car.y);

      if (distance < minDistance) {
        return true; // Overlapping cars found
      }
    }

    return false; // No overlapping cars found
  }

  spawnCandy() {
    const candyXLocation = Phaser.Math.Between(100, this.cameras.main.width - 100);
    const candyYLocation = Phaser.Math.Between(100, this.cameras.main.height - 100);
    const candy = this.candyGroup.create(candyXLocation, candyYLocation, "christmasCandy");
    candy.setCollideWorldBounds(true);
    candy.setBounce(1, 1);
  }

  createNextLevelButton() {
    // Create the next level button
    const nextLevelButton = this.add.image(
      this.cameras.main.width / 2,
      this.cameras.main.height / 2,
      "nextLevel2"
    );
    nextLevelButton.setInteractive({ useHandCursor: true });
    nextLevelButton.on("pointerdown", () => {
            // Save the score in localStorage for Level 1
      localStorage.setItem("Score", this.score.toString());
      this.scene.start("gameScene3", { score: this.score }); // Pass the score as data to Level 2
    }, this);

    // Clear all existing cars and candies
    this.carGroup.clear(true, true);
    this.candyGroup.clear(true, true);

    // Reset the player position
    this.player.x = this.cameras.main.width / 2;
    this.player.y = this.cameras.main.height - 100;
  }

  gameOver() {
    // Save the score in localStorage
    localStorage.setItem("score", this.score.toString());

    this.physics.pause();
    this.gameOverTextStyle = this.add
      .text(1920 / 2, 1080 / 2, "GAME OVER", this.gameOverTextStyle)
      .setOrigin(0.5);
    this.gameOverTextStyle.setInteractive({ useHandCursor: true });
    this.gameOverTextStyle.on("pointerdown", () => this.scene.start("gameScene"));
  }
}

export default GameScene2;

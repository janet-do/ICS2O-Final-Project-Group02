/* global Phaser */

// Copyright (c) 2023 Bonnie Zhu All rights reserved.
//
// Created by: Bonnie Zhu
// Created on: June 2023
// This is the Phaser3 game configuration file

// scene import statements
import MenuScene from "./menuScene.js"
import GameScene from "./gameScene.js"
import GameScene2 from "./gameScene2.js"
import GameScene3 from "./gameScene3.js"

// create the new scenes
const menuScene = new MenuScene()
const gameScene = new GameScene()
const gameScene2 = new GameScene2()
const gameScene3 = new GameScene3()

/**
 * Start Phaser Game.
 */
const config = {
    type: Phaser.AUTO,
    width: 1920,
    height: 1080,
    physics: {
        default: "arcade",
        arcade: {
            debug: false,
        },
    },
    // set background color
    backgroundColor: 0x5f6e7a,
    scale: {
        mode: Phaser.Scale.FIT,
        // we place it in the middle of the page.
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
}

const game = new Phaser.Game(config)
// console.log(game)

// load scenes
// note: remember any "key" is global and CAN NOT be reused!
game.scene.add("menuScene", menuScene)
game.scene.add("gameScene", gameScene)
game.scene.add("gameScene2", gameScene2)
game.scene.add("gameScene3", gameScene3)

// the start scene
game.scene.start("splashScene")

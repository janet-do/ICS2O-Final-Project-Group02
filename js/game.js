/* global Phaser */
// Copyright (c) 2020 Janet Do All rights reserved
//
// Created by: Janet Do
// Created on: Sep 2020

// scene import statements
import MenuScene from "./menuScene.js"
import GameScene from "./level1.js"
import GameScene2 from "./level2.js"
import GameScene3 from "./level3.js"

// create the new scenes
const menuScene = new MenuScene()
const gameScene = new GameScene()
const gameScene2 = new GameScene2()
const gameScene3 = new GameScene3()

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
  //set background color
  backgroundColor: 0xffffff,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    scene: [ gameScene, gameScene2, gameScene3 ]
  },
}
const game = new Phaser.Game(config)

//load scenes
// NOTE: remember any 'key' is global an cannot be reused
game.scene.add("menuScene", menuScene)
game.scene.add("gameScene", gameScene)
game.scene.add("gameScene2", gameScene2)
game.scene.add("gameScene3", gameScene3)

// start title
game.scene.start("menuScene")
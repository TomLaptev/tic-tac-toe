import Phaser from "phaser";
import BootScene from "./scripts/scenes/BootScene";
import PreloadScene from "./scripts/scenes/PreloadScene";
import GameScene from "./scripts/scenes/GameScene";

export const config = {
  type: Phaser.AUTO,
  width: 2560,
  height: 720,
  scene: [BootScene, PreloadScene, GameScene],
  scale: {
    mode: Phaser.Scale.CENTER_HORIZONTALLY,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },

};

export const source = {
  rows: 15,
  cols: 15,
  cellWidth: 40,
  cellHeight: 40,  
}

const game = new Phaser.Game(config);

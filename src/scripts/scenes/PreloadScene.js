import Phaser from "phaser";
import LoadingBar from "../classes/LoadingBar";

import sellJpg1 from "../../assets/sprites/sell1.jpg";
import sellJpg2 from "../../assets/sprites/sell2.jpg";
import sellJpg20 from "../../assets/sprites/sell20.jpg";
import sellJpg3 from "../../assets/sprites/sell3.jpg";
import sellJpg30 from "../../assets/sprites/sell30.jpg";


export default class Preloadscene extends Phaser.Scene {
  constructor() {
    super("Preload");
  }
  preload() {
    this.add.sprite(0, 0, "bg").setOrigin(0);
    this.loadingBar = new LoadingBar(this);
    this.load.image("sell1", sellJpg1);
    this.load.image("sell2", sellJpg2);
    this.load.image("sell20", sellJpg20);
    this.load.image("sell3", sellJpg3);
    this.load.image("sell30", sellJpg30);
    
    
  }
  create() {
    this.scene.start("Game");
  }
}

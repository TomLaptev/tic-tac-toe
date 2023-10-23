import Phaser from "phaser";
import LoadingBar from "../components/LoadingBar";

import imgJpg from "../../assets/sprites/img.jpg";
import imgJpg1 from "../../assets/sprites/img1.jpg";
import imgJpg10 from "../../assets/sprites/img10.jpg";
import imgJpg2 from "../../assets/sprites/img2.jpg";
import imgJpg20 from "../../assets/sprites/img20.jpg";


export default class Preloadscene extends Phaser.Scene {
  constructor() {
    super("Preload");
  }
  preload() {
    this.add.sprite(0, 0, "bg").setOrigin(0);
    this.loadingBar = new LoadingBar(this);
    this.load.image("img", imgJpg);
    this.load.image("img1", imgJpg1);
    this.load.image("img10", imgJpg10);
    this.load.image("img2", imgJpg2);
    this.load.image("img20", imgJpg20);
    
    
  }
  create() {
    this.scene.start("Game");
  }
}

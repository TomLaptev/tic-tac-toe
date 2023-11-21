import Phaser from "phaser";
import LoadingBar from "../components/LoadingBar";

import imgJpg from "../../assets/sprites/img.jpg";
import imgJpg1 from "../../assets/sprites/img1.jpg";
import imgJpg10 from "../../assets/sprites/img10.jpg";
import imgJpg2 from "../../assets/sprites/img2.jpg";
import imgJpg20 from "../../assets/sprites/img20.jpg";
import imgPng1 from "../../assets/sprites/board.png";
import imgPng2 from "../../assets/sprites/Neptune.png";
import imgPng3 from "../../assets/sprites/button.png";
import imgPng4 from "../../assets/sprites/buttonMenu.png";
import imgPng5 from "../../assets/sprites/buttonLevelSelection.png";
import imgPng6 from "../../assets/sprites/buttonHome.png";
import imgPng7 from "../../assets/sprites/pointer.png";
import btnLeft from "../../assets/sprites/left.png";
import btnRight from "../../assets/sprites/right.png";
import btnDown from "../../assets/sprites/down.png";
import btnUp from "../../assets/sprites/up.png";
import btnEnter from "../../assets/sprites/enter.png";

export default class Preloadscene extends Phaser.Scene {
  constructor() {
    super("Preload");
  }
  preload() {
    this.loadingBar = new LoadingBar(this);
    this.load.image("img", imgJpg);
    this.load.image("img1", imgJpg1);
    this.load.image("img10", imgJpg10);
    this.load.image("img2", imgJpg2);
    this.load.image("img20", imgJpg20);
    this.load.image("board", imgPng1);
    this.load.image("Neptune", imgPng2);
    this.load.image("button", imgPng3);
    this.load.image("buttonMenu", imgPng4);
    this.load.image("buttonLevelSelection", imgPng5);
    this.load.image("buttonHome", imgPng6);
    this.load.image("pointer", imgPng7);

    this.load.image("left", btnLeft);
    this.load.image("right", btnRight);
    this.load.image("down", btnDown);
    this.load.image("up", btnUp);
    this.load.image("enter", btnEnter);
  }
  create() {
    this.scene.start("Start");
  }
}

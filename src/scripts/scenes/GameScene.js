import Phaser from "phaser";
import Sell from "../classes/Sell";
import { config } from "../../index.js";
import { source } from "../../index.js";

export default class Gamescene extends Phaser.Scene {
  constructor() {
    super("Game");
  }

  create() {
    this.store = [];
    this.isStar = true;
    this.createBackground();
    this.createButtons();
    this.createSells();
    this.setEvents();
    this.setCursor();
  }

  createBackground() {
    this.add.sprite(0, 0, "bg").setOrigin(0);
  }

  createButtons() {
    let style = {
      font: " 26px Arial",
      fill: "#F30C0C",
    };

    this.buttonX = this.add
      .text(
        this.cameras.main.centerX - 175,
        this.cameras.main.centerY - 325,
        "New game for",
        style
      )
      .setOrigin(0.5)
      .setInteractive();

    this.buttonO = this.add
      .text(
        this.cameras.main.centerX + 95,
        this.cameras.main.centerY - 325,
        "New game for",
        style
      )
      .setOrigin(0.5)
      .setInteractive();
  }

  setCursor() {
    this.buttonX.setInteractive({cursor: 'pointer'});
    this.buttonO.setInteractive({cursor: 'pointer'});
  }

  createSells() {
    this.sells = [];
    let positions = this.getSellsPositions();

    for (const position of positions) {
      this.sells.push(new Sell(this, position));
    }

    this.add
      .sprite(
        this.cameras.main.centerX - 70,
        this.cameras.main.centerY - 325,
        "sell2"
      )
      .setOrigin(0.5, 0.5);
    this.add
      .sprite(
        this.cameras.main.centerX + 200,
        this.cameras.main.centerY - 325,
        "sell3"
      )
      .setOrigin(0.5, 0.5);

    this.input.on("gameobjectdown", this.onCardClicked, this);
  }

  onCardClicked(pointer, sell) {
    let el;

    if (sell.y > 50) {
      sell.hideSell();
      if (this.isStar) {
        if (this.store.length) {
          this.add
            .sprite(
              this.store[this.store.length - 1].x,
              this.store[this.store.length - 1].y,
              "sell3"
            )
            .setOrigin(0, 0);
        }
        el = this.add.sprite(sell.x, sell.y, "sell20").setOrigin(0, 0);
        this.isStar = false;
      } else {
        if (this.store.length) {
          this.add
            .sprite(
              this.store[this.store.length - 1].x,
              this.store[this.store.length - 1].y,
              "sell2"
            )
            .setOrigin(0, 0);
        }

        el = this.add.sprite(sell.x, sell.y, "sell30").setOrigin(0, 0);

        this.isStar = true;
      }
      this.store.length = 0;
      this.store.push(el);
      //console.log(this.store[this.store.length - 1].x);
      console.log(this.store);
    }
  }

  setEvents() {
    this.buttonX.on("pointerdown", this.ActionButtonX, this);
    this.buttonO.on("pointerdown", this.ActionButtonO, this);
  }

  ActionButtonX() {
    console.log("Button1");
  }
  ActionButtonO() {
    console.log("Button2");
  }
  ActionSells() {
    for (let i = 0; i < this.sells.length; i++) {
      console.log(this.sells[i].x);
      console.log(this.sells[i].y);
    }
  }

  getSellsPositions() {
    let positions = [];
    // let sellTexture = this.textures.get("sell1").getSourceImage(); // содержит данные о размерах image
    let sellWidth = 40; //(sellTexture.width + 4) / 5;
    let sellHeight = 40; //(sellTexture.height + 4) / 5;
    let offsetX = (config.width - sellWidth * source.cols) / 2;
    let offsetY =
      (config.height - sellHeight * source.rows) / 2 + sellHeight * 1;

    //let id = 0;
    for (let row = 0; row < source.rows; row++) {
      for (let col = 0; col < source.cols; col++) {
        positions.push({
          //delay: ++id * 1,
          x: offsetX + col * sellWidth,
          y: offsetY + row * sellHeight,
        });
      }
    }
    console.log(positions);
    return positions; //Phaser.Utils.Array.Shuffle(positions); перемешивание массива;
  }
}

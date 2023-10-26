import Phaser from "phaser";
import Sell from "../components/Sell";
import Arrays from "../components/Arrays";
import { config } from "../../index.js";
import { source } from "../../index.js";

export default class Gamescene extends Phaser.Scene {
  constructor() {
    super("Game");
  }

  create() {
    this.add.sprite(0, 0, "bg").setOrigin(0);
    this.createButtons();
    this.createSells();
    //this.adapTemplate();
    //this.setEvents();
    this.store = [];
    this.isStar = true;
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
      .setInteractive({ cursor: "pointer" });

    this.buttonO = this.add
      .text(
        this.cameras.main.centerX + 95,
        this.cameras.main.centerY - 325,
        "New game for",
        style
      )
      .setOrigin(0.5)
      .setInteractive({ cursor: "pointer" });
  }

  createSells() {
    this.sells = [];
    let positions = this.getSellsPositions();

    for (let i = 0; i < positions.length; i++) {
      this.sells[i] = new Sell(this, positions[i]);
      this.sells[i].name = 0; //Отмечаем закрытые(свободные) ячейки
    }

    this.add
      .sprite(
        this.cameras.main.centerX - 70,
        this.cameras.main.centerY - 325,
        "img10"
      )
      .setOrigin(0.5, 0.5);
    this.add
      .sprite(
        this.cameras.main.centerX + 200,
        this.cameras.main.centerY - 325,
        "img20"
      )
      .setOrigin(0.5, 0.5);

    this.input.on("gameobjectdown", this.onCardClicked, this);
  }

  // adapTemplate(){

  // }

  onCardClicked(pointer, sell) {
    if (sell.y >= this.sells[0].y) {
      sell.hideSell();

      let el;

      //для крестика
      //"обесцвечиваем" предыдущий нолик
      if (this.isStar) {
        if (this.store.length) {
          this.add
            .sprite(
              this.store[this.store.length - 1].x,
              this.store[this.store.length - 1].y,
              "img20"
            )
            .setOrigin(0, 0);
        }

        el = this.add.sprite(sell.x, sell.y, "img1").setOrigin(0, 0);
        this.isStar = false;
      } else {
        //для нолика
        //"обесцвечиваем" предыдущий крестик
        if (this.store.length) {
          this.add
            .sprite(
              this.store[this.store.length - 1].x,
              this.store[this.store.length - 1].y,
              "img10"
            )
            .setOrigin(0, 0);
        }

        el = this.add.sprite(sell.x, sell.y, "img2").setOrigin(0, 0);

        this.isStar = true;
      }

      this.store.push(el);

      this.arrays = new Arrays(sell, this.sells, this.store);

      this.arrays.createArrays(sell, this.sells, this.store);

      //console.log(this.arrays.arr1);
      this.arr1 = this.arrays.arr1.slice();
      console.log(this.arr1);

   /*    for (let i = 0; i < this.arr1.length; i++) {
        if (sell.name == "img1" && this.arr1[i].name == "img1") {this.arr1[i].name = 1;}
        if (sell.name == "img2" && this.arr1[i].name == "img2") this.arr1[i].name = 1;
      } */

      console.log(this.arr1);
      this.sh50 = [1, 1, 1, 1, 1];
      let sh50 = []; //this._sh50.slice();
      for (let i = 0; i < this.sh50.length; i++) {        
        if (sell.name == "img1") {
          if ( this.sh50[i]) sh50[i] = "img1";          
        }
        if (sell.name == "img2") {
          if ( this.sh50[i]) sh50[i] = "img2";          
        }
      }
      console.log(this.sh50);
      console.log("--------------");
      //============================================================================
      let winLine = [];
      let count;
      let k;
      outer: while (this.arr1.length >= this.sh50.length) {
        count = 0;
        k = 0;
        for (let i = sh50.length; i > 0; i--) {
          if (sh50[i - 1] == this.arr1[this.arr1.length - 1 - k].name) {
            winLine.push(this.arr1[this.arr1.length - 1 - k]);
            ++count;
            k++;
            if (count == 5) {
              console.log("Ура! Победа");
              
              while (winLine.length > 0) {
                  this.add
                    .sprite(
                      winLine[winLine.length - 1].x,
                      winLine[winLine.length - 1].y,
                      sell.name
                    )
                    .setOrigin(0, 0); 
            
                  winLine.length--
              }
              this.store.length = 0;
              break outer;
            }
          }
        }
        console.log(count);

        this.arr1.pop();
      }
    }
  }
  // setEvents() {
  //   this.buttonX.on("pointerdown", this.ActionButtonX, this);
  //   this.buttonO.on("pointerdown", this.ActionButtonO, this);

  // }

  ActionButtonX() {
    console.log("Button1");
  }
  ActionButtonO() {
    console.log("Button2");
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
    //console.log(positions);
    return positions; //Phaser.Utils.Array.Shuffle(positions); перемешивание массива;
  }
}

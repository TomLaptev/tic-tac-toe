import Phaser from "phaser";
import Sell from "../components/Sell";
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

    // for (const position of positions) {
    //   this.sells.push(new Sell(this, position));
    //   new Sell(this, position).name == false;
    // }

    for (let i = 0; i < positions.length; i++) {
      this.sells[i] = new Sell(this, positions[i]);
      this.sells[i].name = false; //Отмечаем закрытые ячейки
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

  onCardClicked(pointer, sell) {
    if (sell.y >= this.sells[0].y) {
      sell.hideSell();
    }

    let el;

    if (this.isStar) {
      //для крестика
      // =======================================================================
      //"обесцвечиваем" предыдущий нолик
      if (this.store.length) {
        this.add
          .sprite(
            this.store[this.store.length - 1].x,
            this.store[this.store.length - 1].y,
            "img20"
          )
          .setOrigin(0, 0);
      }
      // =======================================================================
      el = this.add.sprite(sell.x, sell.y, "img1").setOrigin(0, 0);
      this.isStar = false;
    } else {
      //для нолика
      // =======================================================================
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
      // =======================================================================

      el = this.add.sprite(sell.x, sell.y, "img2").setOrigin(0, 0);

      this.isStar = true;
    }

    this.store.push(el);

    //====== Создаем массивы для нажатой ячейки sell==========
    this.arr1 = []; //горизонтальный массив
    this.arr2 = []; //вертикальный массив
    this.arr3 = []; //диагон. массив (лево-верх -> право-низ)
    this.arr4 = []; //диагон. массив (право-верх -> лево-низ)

    for (let i = 0; i < this.sells.length; i++) {
      if (this.sells[i].x == sell.x && this.sells[i].y == sell.y) {
        //Присваиваем открытым ячейкам значения крестик или нолик
        this.sells[i].name = this.store[this.store.length - 1].texture.key;
      }

      /* this.store - массив с нажатыми ячейками
        sell.x, sell.y - координаты нажатой ячейки
        this.store[i].texture.key - тип фигуры в ячейке массива с нажатыми ячейками
        this.sells[i].name = false - ячейка свободна
        this.sells[i].name = img1 - крестик
        this.sells[i].name = img2 - нолик */

      //Заполняем массивы ячейками массива this.sells в заданном диапазоне

      // Для массива arr1
      if (
        this.sells[i].x >= sell.x - 4 * sell.width &&
        this.sells[i].x <= sell.x + 4 * sell.width &&
        this.sells[i].y == sell.y
      ) {
        this.arr1.push(this.sells[i]);
      }
      // Для массива arr2
      if (
        this.sells[i].y >= sell.y - 4 * sell.height &&
        this.sells[i].y <= sell.y + 4 * sell.height &&
        this.sells[i].x == sell.x
      ) {
        this.arr2.push(this.sells[i]);
      }
      // Для массива arr3
      if (
        this.sells[i].x >= sell.x - 4 * sell.width &&
        this.sells[i].x <= sell.x + 4 * sell.width &&
        this.sells[i].x - this.sells[i].y == sell.x - sell.y
      ) {
        this.arr3.push(this.sells[i]);
      }
      // Для массива arr4
      if (
        this.sells[i].x >= sell.x - 4 * sell.width &&
        this.sells[i].x <= sell.x + 4 * sell.width &&
        this.sells[i].x + this.sells[i].y == sell.x + sell.y
      ) {
        this.arr4.push(this.sells[i]);
      }
    }

   /*  // Дополняем массив arr1 до 9 элементов
    // с левого края
    if (this.arr1[0].x == this.sells[0].x) {
      while (this.arr1.length < 9) {
        this.arr1.unshift(7);
      }
    }
    // с правого края
    if (this.arr1[this.arr1.length - 1].x == this.sells[source.cols - 1].x) {
      while (this.arr1.length < 9) {
        this.arr1.push(7);
      }
    }

    // Дополняем массив arr2 до 9 элементов
    // с левого края
    if (this.arr2[0].y == this.sells[0].y) {
      while (this.arr2.length < 9) {
        this.arr2.unshift(7);
      }
    }
    // с правого края
      if (
      this.arr2[this.arr2.length - 1].y ==
      this.sells[source.rows * source.cols - 1].y
    ) {
      while (this.arr2.length < 9) {
        this.arr2.push(7);
      }
    } */

    // При ходе крестиков
    // заменяем крестики-нолики-свободные ячейки на
    // 1 - 7 - 0
    //=================================================================================
    /*  for (let j = 1; j < 5; j++) { }   
    for (let i = 0; i < `this.arr${[j]}`.length; i++) {
      if (sell.name == "img1"){ console.log(`this.arr${[j]}[${i}]`.name)
        if (`this.arr${[j]}[${i}].${name}` == "img1") {
         
          `this.arr${[j]}.splice(${i}, 1, 1)`
         } 
         if (`this.arr${[j]}[${i}].${name}` == "img2") {
          `this.arr${[j]}.splice(${i}, 1, 7)`
         } 
         if (`this.arr${[j]}[${i}].${name}` == false) {
          `this.arr${[j]}.splice(${i}, 1, 0)`
         }      
         //console.log(sell.name) 
      }
}*/
    //===================================================================================
     // При ходе крестиков   ==== arr1 =====
    // заменяем крестики-нолики-свободные ячейки на
    for (let i = 0; i < this.arr1.length; i++) {
      if (sell.name == "img1") {
        if (this.arr1[i].name == "img1") {
          this.arr1.splice(i, 1, 1);
        }
        if (this.arr1[i].name == "img2") {
          this.arr1.splice(i, 1, 7);
        }
        if (this.arr1[i].name == false) {
          this.arr1.splice(i, 1, 0);
        }
      }
      // При ходе ноликов
      // заменяем нолики-крестики-свободные ячейки на
      /**/ if (sell.name == "img2") {
        if (this.arr1[i].name == "img2") {
          this.arr1.splice(i, 1, 1);
        }
        if (this.arr1[i].name == "img1") {
          this.arr1.splice(i, 1, 7);
        }
        if (this.arr1[i].name == false) {
          this.arr1.splice(i, 1, 0);
        }
      }
    }
    //===================================================================================
    // При ходе крестиков   ==== arr2 =====
    // заменяем крестики-нолики-свободные ячейки на
    for (let i = 0; i < this.arr2.length; i++) {
      if (sell.name == "img1") {
        if (this.arr2[i].name == "img1") {
          this.arr2.splice(i, 1, 1);
        }
        if (this.arr2[i].name == "img2") {
          this.arr2.splice(i, 1, 7);
        }
        if (this.arr2[i].name == false) {
          this.arr2.splice(i, 1, 0);
        }
      }

      // При ходе ноликов
      // заменяем нолики-крестики-свободные ячейки на
      // 1 - 7 - 0
      if (sell.name == "img2") {
        if (this.arr2[i].name == "img2") {
          this.arr2.splice(i, 1, 1);
        }
        if (this.arr2[i].name == "img1") {
          this.arr2.splice(i, 1, 7);
        }
        if (this.arr2[i].name == false) {
          this.arr2.splice(i, 1, 0);
        }
      }
    }
    //===================================================================================
    // При ходе крестиков   ==== arr3 =====
    // заменяем крестики-нолики-свободные ячейки на
    for (let i = 0; i < this.arr3.length; i++) {
      if (sell.name == "img1") {
        if (this.arr3[i].name == "img1") {
          this.arr3.splice(i, 1, 1);
        }
        if (this.arr3[i].name == "img2") {
          this.arr3.splice(i, 1, 7);
        }
        if (this.arr3[i].name == false) {
          this.arr3.splice(i, 1, 0);
        }
      }

      // При ходе ноликов
      // заменяем нолики-крестики-свободные ячейки на
      // 1 - 7 - 0
      if (sell.name == "img2") {
        if (this.arr3[i].name == "img2") {
          this.arr3.splice(i, 1, 1);
        }
        if (this.arr3[i].name == "img1") {
          this.arr3.splice(i, 1, 7);
        }
        if (this.arr3[i].name == false) {
          this.arr3.splice(i, 1, 0);
        }
      }
    }
    //===================================================================================
    // При ходе крестиков   ==== arr4 =====
    // заменяем крестики-нолики-свободные ячейки на
    for (let i = 0; i < this.arr4.length; i++) {
      if (sell.name == "img1") {
        if (this.arr4[i].name == "img1") {
          this.arr4.splice(i, 1, 1);
        }
        if (this.arr4[i].name == "img2") {
          this.arr4.splice(i, 1, 7);
        }
        if (this.arr4[i].name == false) {
          this.arr4.splice(i, 1, 0);
        }
      }

      // При ходе ноликов
      // заменяем нолики-крестики-свободные ячейки на
      // 1 - 7 - 0
      if (sell.name == "img2") {
        if (this.arr4[i].name == "img2") {
          this.arr4.splice(i, 1, 1);
        }
        if (this.arr4[i].name == "img1") {
          this.arr4.splice(i, 1, 7);
        }
        if (this.arr4[i].name == false) {
          this.arr4.splice(i, 1, 0);
        }
      }
    }

    /* */
    console.log(this.arr1);
    console.log(this.arr2);
    console.log(this.arr3);
    console.log(this.arr4);

    this.store.Step = Math.ceil(this.store.length / 2);

    console.log(this.store.Step);
    console.log("........");
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
    //console.log(positions);
    return positions; //Phaser.Utils.Array.Shuffle(positions); перемешивание массива;
  }
}

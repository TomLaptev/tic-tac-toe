import Phaser from "phaser";
import Cell from "../components/Cell";
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
    this.createCells();
    this.setEvents();
    //this.createTimer();
    this.store = [];
    this.isStar = true;
    this.isFinish = true;
    this.isZero = false;
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

  createCells() {
    this.cells = [];
    let positions = this.getCellsPositions();

    for (let i = 0; i < positions.length; i++) {
      this.cells[i] = new Cell(this, positions[i]);
      this.cells[i].name = 0; //Отмечаем закрытые(свободные) ячейки
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
  }

  onCardClicked(pointer, cell) {
    if (this.isFinish && cell.y >= this.cells[0].y) {
      cell.hideCell();
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
        el = this.add.sprite(cell.x, cell.y, "img1").setOrigin(0, 0);
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

        el = this.add.sprite(cell.x, cell.y, "img2").setOrigin(0, 0);
        this.isStar = true;
      }

      this.store.push(el);
      this.arrays = new Arrays(cell, this.cells, this.store);
      this.arrays.createArrays(cell, this.cells, this.store);

      this.sh50 = [1, 1, 1, 1, 1];
      let sh50 = [];
      for (let i = 0; i < this.sh50.length; i++) {
        if (cell.name == "img1") {
          if (this.sh50[i]) sh50[i] = "img1";
        }
        if (cell.name == "img2") {
          if (this.sh50[i]) sh50[i] = "img2";
        }
      }
     
      let winLine = [];
      let count;
      let k;

      let arrCell = this.arrays.arraysCell.slice();
      for (let j = 0; j < arrCell.length; j++) {
        outer: while (arrCell[j].length >= this.sh50.length) {
          winLine.length = 0;
          count = 0;
          k = 0;
          for (let i = sh50.length; i > 0; i--) {
            if (sh50[i - 1] == arrCell[j][arrCell[j].length - 1 - k].name) {
              winLine.push(arrCell[j][arrCell[j].length - 1 - k]);
              ++count;
              k++;
              if (count == 5) {
                console.log("Ура! Победа");
                //console.log(winLine.length);
                this.isFinish = false;
                while (winLine.length > 0) {
                  this.add
                    .sprite(
                      winLine[winLine.length - 1].x,
                      winLine[winLine.length - 1].y,
                      cell.name
                    )
                    .setOrigin(0, 0);

                  winLine.length--;
                }
                this.store.length = 0;
                break outer;
              }
            }
          }
          arrCell[j].pop();
        }
      }
    }
  }
  setEvents() {
    this.input.on("gameobjectdown", this.onCardClicked, this);
    this.buttonX.on("pointerdown", this.ActionButtonX, this);
    this.buttonO.on("pointerdown", this.ActionButtonO, this);
  }

  ActionButtonX() {
    this.scene.restart();
  }
  ActionButtonO() {
    this.isZero = true;
    this.isStar = true;
    this.store.length = 0;
    this.isFinish = true;
    this.createCells()
    this.onCardClicked(this, this.cells[112]);
  }
  
  getCellsPositions() {
    let positions = [];
    let offsetX = (config.width - source.cellWidth * source.cols) / 2;
    let offsetY =
      (config.height - source.cellHeight * source.rows) / 2 + source.cellHeight * 1;

    for (let row = 0; row < source.rows; row++) {
      for (let col = 0; col < source.cols; col++) {
        positions.push({
          x: offsetX + col * source.cellWidth,
          y: offsetY + row * source.cellHeight,
        });
      }
    }
    return positions; 
  }
}

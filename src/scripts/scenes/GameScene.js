import Phaser from "phaser";
import Cell from "../components/Cell";
import Arrays from "../components/Arrays";
import { config } from "../../index.js";
import { source } from "../../index.js";
import templates from "../components/templates.json";

export default class Gamescene extends Phaser.Scene {
  constructor() {
    super("Game");
  }

  create() {
    this.add.sprite(0, 0, "bg").setOrigin(0);
    this.createButtons();
    this.createCells();
    this.setEvents();

    this.store = [];
    this.isCross = true;
    this.isFinish = false;
    this.btn0WasPressed = false;
    //cellsFieldGA = [];
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
      this.cells[i] = new Cell(this, positions[i], i);
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

  onCellClicked(pointer, cell) {
    if (!this.isFinish && cell.y >= this.cells[0].y) {
      cell.hideCell();
      let el;
      //для крестика "обесцвечиваем" предыдущий нолик
      if (this.isCross) {
        if (this.store.length > 0) {
          this.add
            .sprite(
              this.store[this.store.length - 1].x,
              this.store[this.store.length - 1].y,
              "img20"
            )
            .setOrigin(0, 0);
        }
        el = this.add.sprite(cell.x, cell.y, "img1").setOrigin(0, 0);
        this.isCross = false;
        cell.name = "img1";
      } else {
        //для нолика "обесцвечиваем" предыдущий крестик
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
        this.isCross = true;
        cell.name = "img2";
      }

      this.store.push(el);

      // Определяем номер хода(одинаков для обеих сторон)
      this.Step = Math.ceil(this.store.length / 2);

      // Запускаем ф-ю createArrays() в кл. Arrays и получаем массив,
      // для ячейки cell, содержащий в себе 4 массива
      let a = new Arrays(cell, this.cells);
      let arrCell = a.createArrays();

      this.store[this.store.length - 1].name = cell.name;
      // this.store - массив с нажатыми ячейками
      //   cell.x, cell.y - координаты нажатой ячейки
      //   this.cells[i].name = false - ячейка свободна
      //   this.cells[i].name = img1 - крестик
      //   this.cells[i].name = img2 - нолик

      // Подключаем templates.json
      this.templates = templates.templatesStore;

      // Проверка наличия линии победителя
      let winningTemplate = [1, 1, 1, 1, 1];
      for (let i = 0; i < 5; i++) {
        if (cell.name == "img1") {
          winningTemplate[i] = "img1";
        }
        if (cell.name == "img2") {
          winningTemplate[i] = "img2";
        }
      }

      let winLine = [];
      let count;
      for (let i = 1; i < arrCell.length; i++) {
        outer: while (arrCell[i].length >= winningTemplate.length) {
          winLine.length = 0;
          count = 0;
          for (let j = winningTemplate.length; j > 0; j--) {
            if (
              winningTemplate[j - 1] ==
              arrCell[i][arrCell[i].length - 1 - count].name
            ) {
              winLine.push(arrCell[i][arrCell[i].length - 1 - count]);
              count++;
              if (count == 5) {
                console.log("Ура! Победа");
                this.isFinish = true;
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
          arrCell[i].pop();
        }
      }
    }
    console.log("====================================");
    this.chooseFirstStepGA();
  }

  //======================================================================================

  chooseFirstStepGA() {
    if (this.store.length == 1 && !this.btn0WasPressed) {
      let firstStep = this.chooseIndex(
        this.store[this.store.length - 1].x,
        this.store[this.store.length - 1].y
      );
      let centralCell = Math.floor(this.cells.length / 2);

      if (firstStep != centralCell) {

        let stepY = this.cells[firstStep].y;
        let stepX = this.cells[firstStep].x;

        if (
          stepY < this.cells[this.cells.length - 1].y - 1 * source.cellHeight &&
          stepY > this.cells[centralCell].y
        ) {
          stepY -= source.cellHeight;
        } else if (
          stepY > this.cells[0].y + 1 * source.cellHeight &&
          stepY < this.cells[centralCell].y
        ) {
          stepY += source.cellHeight;
        } else stepY = this.cells[centralCell].y;
        if (
          stepX < this.cells[this.cells.length - 1].x - 1 * source.cellWidth &&
          stepX > this.cells[centralCell].x
        ) {
          stepX -= source.cellWidth;
        } else if (
          stepX > this.cells[0].x + 1 * source.cellWidth &&
          stepX < this.cells[centralCell].x
        ) {
          stepX += source.cellWidth;
        } else {
          stepX = this.cells[centralCell].x;
        }

        this.onCellClicked(this, this.cells[this.chooseIndex(stepX, stepY)]);
      } else {
        let a = this.templates[0].arr[Math.floor(Math.random() * 8)];
        this.onCellClicked(this, this.cells[a + centralCell]);
      }
    } else this.chooseStepGA();
  }

  chooseStepGA() {
    let cellsGA = [];
    let cellsR = [];
    let cellsFieldGA = [];
    let checkArrays = [];
    let cellsFieldR = [];
    if (this.store.length > 2 && !this.btn0WasPressed) {
      //Собираем все свои ходы в массив cellsGA, ходы противника - в cellsR
      for (let i = 0; i < this.store.length; i++) {
        this.store[i].id = this.chooseIndex(this.store[i].x, this.store[i].y);
        if (this.store[i].name == "img2") {
          cellsGA.push(this.store[i]);
          // console.log(this.store[i].x + "  " + this.store[i].y);
        } else {
          cellsR.push(this.store[i]);
          //console.log(this.store[i].x + "  " + this.store[i].y);
        }
      }

      //Собираем все свободные ячейки возможных ходов ИА для создания проверочных массивов в cellsFieldGA
      this.createCellsField(cellsGA, cellsFieldGA);
      /*  //Для противника в cellsFieldR*/
      this.createCellsField(cellsR, cellsFieldR);

      /*  //Создаем массивы checkArrays(в каждом 4: гориз., верт. и диагон-е)
      // для каждой ячейки cellsField(для сравнения с шаблонами)*/
      console.log(cellsFieldGA[9].id);
      this.createCheckArrays(checkArrays, cellsFieldGA);
      this.createCheckArrays(checkArrays, cellsFieldR);
      console.log(checkArrays[9]);
      //this.createCheckArrays(cellsFieldR);

      /**/ // Делаем копии шаблонов, заменяя в них 1 на "img2" для ноликов
       this.creatAdaptedTemplates("img2");
    }
  }

  chooseIndex(x, y) {
    //Вычисляем номер ячейкм по координатам
    this.Index =
      ((y - this.cells[0].y) * source.cols) / source.cellHeight +
      (x - this.cells[0].x) / source.cellWidth;
    return this.Index;
  }

  createCellsField(Array, Field) {
    //Собираем все ячейки возможных ходов для создания проверочных массивов в Field
    for (let i = 0; i < Array.length; i++) {
      for (let j = 0; j < this.templates[1].arr.length; j++) {
        if (
          this.cells[Array[i].id + this.templates[1].arr[j]] != null && // ячейка существует
          this.cells[Array[i].id + this.templates[1].arr[j]].name == 0 // ячейка свободна
        ) {
          this.cells[Array[i].id + this.templates[1].arr[j]].name = 1; // обозначаем ее как занятую
          Field.push(this.cells[Array[i].id + this.templates[1].arr[j]]); // отправляем в массив
        }
      }
    }
    Field.forEach((el) => {
      //console.log(el.id)
      el.name = 0; // вновь обозначаем ее как свободную
    });
    return Field;
  }

  createCheckArrays(arr, Field) {
    for (let i = 0; i < Field.length; i++) {
      let a = new Arrays(Field[i], this.cells);
      arr[i] = a.createArrays();
    }

    return arr;
  }

  creatAdaptedTemplates(name) {
    let symbolTemplate = [];
    for (let i = 2; i < this.templates.length; i++) {
      symbolTemplate[i - 2] = this.templates[i].arr;
    }
    for (let i = 0; i < symbolTemplate.length; i++) {
      for (let j = 0; j < symbolTemplate[i].length; j++) {
        if (symbolTemplate[i][j] == 1) {
          symbolTemplate[i][j] = name;
        }
      }
    }
    console.log(symbolTemplate);
  }

  setEvents() {
    this.input.on("gameobjectdown", this.onCellClicked, this);
    this.buttonX.on("pointerdown", this.ActionButtonX, this);
    this.buttonO.on("pointerdown", this.ActionButtonO, this);
  }

  ActionButtonX() {
    this.scene.restart();
  }
  ActionButtonO() {
    let centralCell = Math.floor(this.cells.length / 2);
    this.isCross = true;
    this.store.length = 0;
    this.isFinish = false;
    this.createCells();
    this.cells[centralCell].id = centralCell;
    this.btn0WasPressed = true;
    this.onCellClicked(this, this.cells[centralCell]);
  }

  getCellsPositions() {
    let positions = [];
    let offsetX = (config.width - source.cellWidth * source.cols) / 2;
    let offsetY =
      (config.height - source.cellHeight * source.rows) / 2 +
      source.cellHeight * 1;

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

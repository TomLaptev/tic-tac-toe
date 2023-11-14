import Phaser from "phaser";
import Cell from "../components/Cell";
import Arrays from "../components/Arrays";
import { config, source } from "../../index.js";
import template_X from "../components/template_X.json";
import template_O from "../components/template_O.json";
import { name } from "file-loader";

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
    this.isFinish = false;
    this.btn0WasPressed = false;
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
      this.cells[i].name = false; //Отмечаем закрытые(свободные) ячейки
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
    if (cell && cell.name === false && cell.y >= this.cells[0].y ) {
      //для крестика "обесцвечиваем" предыдущий нолик
      if (this.store.length % 2 == 0) {
        if (this.store.length > 0) {
          this.add
            .sprite(this.store.at(-1).x, this.store.at(-1).y, "img20")
            .setOrigin(0, 0);
        }
        this.add.sprite(cell.x, cell.y, "img1").setOrigin(0, 0);
        cell.name = 1;
      } else {
        //для нолика "обесцвечиваем" предыдущий крестик
        if (this.store.length % 2) {
          this.add
            .sprite(this.store.at(-1).x, this.store.at(-1).y, "img10")
            .setOrigin(0, 0);
        }

        this.add.sprite(cell.x, cell.y, "img2").setOrigin(0, 0);
        cell.name = 0;
      }
      this.store.push(cell);

      // Проверка наличия победителя

      // Запускаем createArrays() в кл. Arrays и получаем массив,
      // для ячейки cell, содержащий в себе 4 массива
      let testWinKit = new Arrays(cell, this.cells).createArrays();

      let winLine = [];
      let count;
      let symbol = cell.name == 1 ? (symbol = "img1") : (symbol = "img2");
      for (let i = 1; i < testWinKit.length; i++) {
        outer: while (testWinKit[i].length >= 5) {
          winLine.length = 0;
          count = 0;
          for (let j = 0; j < 5; j++) {
            if (
              testWinKit[i][testWinKit[i].length - 1 - count].name === cell.name
            ) {
              winLine.push(testWinKit[i][testWinKit[i].length - 1 - count]);
              count++;
              if (count == 5) {
                console.log("Ура! Победа");
                this.isFinish = true;
                while (winLine.length > 0) {
                  this.add
                    .sprite(
                      winLine[winLine.length - 1].x,
                      winLine[winLine.length - 1].y,
                      symbol
                    )
                    .setOrigin(0, 0);

                  winLine.length--;
                }
                this.store.length = 0;
                break outer;
              }
            }
          }
          testWinKit[i].pop();
        }
      }
    } 
     //====================================

    if (!this.isFinish && this.store.length > 0) {
      this.chooseFirstStepGA();
    }
  }

  chooseFirstStepGA() {
    this.template_X = template_X.templatesStore;
    this.template_O = template_O.templatesStore;
    let correctionX = 0;
    let correctionY;
    let indexPosition;

    if (this.store.at(-1).x < this.cells[0].x + 4 * source.cellWidth) {
      correctionX = 1;
    } else if (
      this.store.at(-1).x >
      this.cells.at(-1).x - 4 * source.cellWidth
    ) {
      correctionX = -1;
    }
    if (
      this.store.at(-1).y <
      this.cells[0].y + Math.ceil(source.rows / 2) * source.cellHeight
    ) {
      correctionY = 1;
    } else correctionY = -1;

    if (this.store.length === 1 && !this.btn0WasPressed) {
      indexPosition =
        this.store.at(-1).id + 2 * source.cols * correctionY + 2 * correctionX;
      this.onCellClicked(this, this.cells[indexPosition]);
    } else this.chooseStepGA();
  }

  chooseStepGA() {
    let cellsGA = []; // массив ходов АИ
    this.cellsR = []; // массив ходов игрока
    //this.lastStep = [this.store.at(-1)];
    this.cellsFieldGA = []; // массив возможных ходов АИ
    this.cellsFieldR = []; // ---------//------- игрока
    this.testKitLastMoves = [];
    this.testKitGA = []; // 0-й эл. - корневая ячейка из this.cellsFieldGA. +4 тестовых массива
    this.testKitR = []; // набор тестов для возможных ходов

    if (
      this.store.length > 2 &&
      !this.btn0WasPressed
      /*  && this.store[this.store.length-1].name === 1*/
    ) {
      for (let i = 0; i < this.store.length; i++) {
        if (this.store[i].name === 1) {
          this.cellsR.push(this.store[i]);
        }
        if (this.store[i].name === 0) {
          cellsGA.push(this.store[i]);
        }
      }

      // console.log(this.cellsR);
      // console.log(cellsGA);

      //Собираем все свободные ячейки возможных ходов ИА для создания проверочных массивов в this.cellsFieldGA
      this.createCellsField(cellsGA, this.cellsFieldGA);
      //Для противника в cellsFieldR
      this.createCellsField(this.cellsR, this.cellsFieldR);

      //console.log(this.cellsFieldGA);
      //console.log(cellsFieldR);
      /**/
      //Создаем массивы testKit(в каждом: тестируемая ячейка и 4 массива - гориз., верт. и диагон-е)
      // для последнего хода и каждой ячейки cellsField(для сравнения с шаблонами)
      this.createTestKit(this.testKitLastMoves, this.cellsR);
      this.createTestKit(this.testKitGA, this.cellsFieldGA);
      this.createTestKit(this.testKitR, this.cellsFieldR);

      // console.log(this.testKitGA);
      //console.log(testKitR);

      // Определяем вес возможных ходов в атаке АИ.
      this.getWeightField(this.testKitLastMoves, this.template_X);
      this.getWeightField(this.testKitR, this.template_X);
      this.getWeightField(this.testKitGA, this.template_O);

      //============== Массив (this.sampleGA) 'лучших' возможных ходов АИ === start =============
      this.sampleGA = [];
      let index;
      for (let i = 0; i < 5; i++) {
        let Max = 0;
        for (let j = 0; j < this.cellsFieldGA.length; j++) {
          if (this.cellsFieldGA[j].w > Max) {
            Max = this.cellsFieldGA[j].w;
            index = j;
          }
        }
        this.sampleGA.push(this.cellsFieldGA[index]);
        this.cellsFieldGA.splice(index, 1);
      }
      console.log("------------------------------");

      this.bestGA; // id выбранной ячейки
      let Max = 0;
      for (let i = 0; i < this.sampleGA.length; i++) {
        if (this.sampleGA[i].data > Max) {
          Max = this.sampleGA[i].data;
          this.bestGA = i;
        }
      }
      //====================== end ====================================================

      /**/  for (let i = 0; i < this.sampleGA.length; i++) {
        console.log(this.sampleGA[i].id + " " + this.sampleGA[i].data);
        console.log(this.sampleGA[i].id + " " + this.sampleGA[i].w);
      } 

      //================ Массив (this.sampleR) 'лучших' возможных ходов соперника ===== start ==========
      this.sampleR = [];
      for (let i = 0; i < 5; i++) {
        let Max = 0;
        for (let j = 0; j < this.cellsFieldR.length; j++) {
          if (this.cellsFieldR[j].z > Max) {
            Max = this.cellsFieldR[j].z;
            index = j;
          }
        }

        this.sampleR.push(this.cellsFieldR[index]);
        this.cellsFieldR.splice(index, 1);
      }

      this.bestR; // id выбранной ячейки
      Max = 0;
      for (let i = 0; i < this.sampleR.length; i++) {
        if (this.sampleR[i].data > Max) {
          Max = this.sampleR[i].data;
          this.bestR = i;
        }
      }
      //=============================== end =========================================
      console.log(this.sampleGA[this.bestGA].id)
      console.log(this.sampleR[this.bestR].id)
      //this.chooseBestStep(this.sampleGA, this.bestGA);
      
      //============ Выбираем ячейку из this.cellsR с максимальным z =================
      this.maxAttackMadeMoves;  // id выбранной ячейки
      Max = 0;
      for (let i = 0; i < this.cellsR.length; i++) {
        if (this.cellsR[i].z > Max) {
          Max = this.cellsR[i].z;
          this.maxAttackMadeMoves = i;
        }
      }
      //=============================== end =========================================
      console.log(this.cellsR[ this.maxAttackMadeMoves].z + "   " + this.cellsR[ this.maxAttackMadeMoves].id);

      //============= АИ ходит вторым. Выбор хода ====== start ===========

      if (this.store[this.store.length - 1].name === 1) {
        /**/ console.log(this.sampleGA[0].w + "   " + this.store.at(-1).z + "   " + this.store.at(-1).id);
        console.log("------------------------------");    

        if (
          this.sampleGA[0].w >= this.template_X[2].attackWeight || // 5

          (this.sampleGA[0].w >= this.template_X[4].attackWeight && //откр.4
          this.cellsR[ this.maxAttackMadeMoves].z < this.template_X[4].protectionWeight) /**/ || //закр.4
            
          (this.cellsR[ this.maxAttackMadeMoves].z < this.template_X[9].protectionWeight/* && //откр.3
            this.sampleR[0].z < this.template_X[4].protectionWeight  + 2 * this.template_X[13].protectionWeight */) 
        ) {console.log(123 + "  " + this.cellsR[ this.maxAttackMadeMoves].z)
          this.onCellClicked(this, this.cells[this.sampleGA[this.bestGA].id]);
        } else{console.log(321+ " " + this.cells[this.sampleR[this.bestR].id].z)
          this.onCellClicked(this, this.cells[this.sampleR[this.bestR].id]);
        }
      }
      //=========================== end ===================================
    }
  }

  createCellsField(ARRAY, FIELD) {
    //Собираем все ячейки возможных ходов для АИ и игрока в свой массив
    for (let i = 0; i < ARRAY.length; i++) {
      for (let j = 0; j < this.template_X[1].arr.length; j++) {
        if (
          this.cells[ARRAY[i].id + this.template_X[1].arr[j]] != null && // ячейка существует
          this.cells[ARRAY[i].id + this.template_X[1].arr[j]].name === false && // ячейка свободна
          Math.abs(
            this.cells[ARRAY[i].id + this.template_X[1].arr[j]].x - ARRAY[i].x
          ) <
            3 * source.cellWidth //ячейка не далее 2 длин своей ширины
        ) {
          this.cells[ARRAY[i].id + this.template_X[1].arr[j]].name = 1; // обозначаем ее как занятую
          FIELD.push(this.cells[ARRAY[i].id + this.template_X[1].arr[j]]); // отправляем в массив
        }
      }
    }
    FIELD.forEach((el) => {
      el.name = false; // вновь обозначаем ячейки как свободные
    });
    return FIELD;
  }

  createTestKit(ARR, FIELD) {
    for (let i = 0; i < FIELD.length; i++) {
      ARR[i] = new Arrays(FIELD[i], this.cells).createArrays();
    }
    return ARR;
  }

  getWeightField(TEST, TEMPLATE) {
    let count;
    let test = [];

    for (let i = 0; i < TEST.length; i++) {
      if (TEST === this.testKitGA) {
        TEST[i][0].name = 0;
        this.testKitGA[i][0].w = 0;
      } else if (TEST === this.testKitR) {
        TEST[i][0].name = 1;
        this.testKitR[i][0].z = 0;
      } else if (TEST === this.testKitLastMoves) {
        this.testKitLastMoves[i][0].z = 0;
      }
      outer: for (let j = 1; j < 5; j++) {
        // проходим по шаблонам
        for (let k = 2; k < TEMPLATE.length; k++) {
          count = 0;
          // выбираем тест из набора и создаем его копию
          test = TEST[i][j].slice();
          while (test.length >= TEMPLATE[k].arr.length) {
            // проходим по тесту и шаблону с конца
            if (
              test[test.length - 1 - count].name ===
              TEMPLATE[k].arr[TEMPLATE[k].arr.length - 1 - count]
            ) {
              count++;
              if (count === TEMPLATE[k].arr.length) {
                if (TEST === this.testKitGA) {
                  this.testKitGA[i][0].w += TEMPLATE[k].attackWeight;
                } else if (TEST === this.testKitR) {
                  this.testKitR[i][0].z += TEMPLATE[k].protectionWeight;
                } else if (TEST === this.testKitLastMoves) {
                  this.testKitLastMoves[i][0].z += TEMPLATE[k].protectionWeight;
                }

                continue outer;
              }
            } else {
              test.pop();
              count = 0;
            }
          }
        }
      }
      TEST[i][0].data = TEST[i][0].w + TEST[i][0].z;
      if (TEST !== this.testKitLastMoves) {
        TEST[i][0].name = false;
      }
    }
  }

  chooseBestStep(SAMPLE, INDEX) {
    INDEX;
    let Max = 0;
    for (let i = 0; i < SAMPLE.length; i++) {
      if (SAMPLE[i].data > Max) {
        Max = SAMPLE[i].data;
        INDEX = i;
      }
    }
  }

  setEvents() {
    this.input.on("gameobjectdown", this.onCellClicked, this);
    this.buttonX.on("pointerdown", this.ActionButtonX, this);
    this.buttonO.on("pointerdown", this.ActionButtonO, this);
  }

  ActionButtonX() {
    this.store.length = 0;
    this.createCells(); 
    this.btn0WasPressed = false; 
  }
  ActionButtonO() {
    let centralCell = Math.floor(this.cells.length / 2);
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

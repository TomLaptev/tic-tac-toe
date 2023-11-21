import Phaser from "phaser";
import Cell from "../components/Cell";
import Arrays from "../components/Arrays";
import { config, source } from "../../index.js";
import template_X from "../components/template_X.json";
import template_O from "../components/template_O.json";

export default class Gamescene extends Phaser.Scene {
  constructor() {
    super("Game");
  }

  create() {
    this.add.sprite(0, 0, "background").setOrigin(0);
    this.createServiceButtons();
    this.createCells();
    this.createControlButtons();
    this.createText();
    this.createPointer();
    this.setEvents();
    this.store = [];
    this.isFinish = false;
    this.btn0WasPressed = false;
    this.cellsGA = []; // массив ходов АИ
    this.cellsR = []; // массив ходов игрока
  }

  createPointer() {
    if (true) {
      this.Pointer = this.add
      .sprite(
        (this.cells[0].x + this.cells.at(-1).x) / 2,
        (this.cells[0].y + this.cells.at(-1).y) / 2,
        "pointer"
      )
      .setOrigin(0, 0)
    }
  }

  createControlButtons() {
    this.btnLeft = this.add
    .sprite(
      this.cameras.main.centerX + 0,
      this.cameras.main.centerY + 170,
      "left"
    )
    .setOrigin(0, 0)
    .setInteractive();

    this.btnRight = this.add
    .sprite(
      this.cameras.main.centerX + 200,
      this.cameras.main.centerY + 170,
      "right"
    )
    .setOrigin(0, 0)
    .setInteractive();

    this.btnDown = this.add
    .sprite(
      this.cameras.main.centerX + 100,
      this.cameras.main.centerY + 240,
      "down"
    )
    .setOrigin(0, 0)
    .setInteractive();

    this.btnUp = this.add
    .sprite(
      this.cameras.main.centerX + 100,
      this.cameras.main.centerY + 100,
      "up"
    )
    .setOrigin(0, 0)
    .setInteractive();

    this.btnEnter = this.add
    .sprite(
      this.cameras.main.centerX - 250,
      this.cameras.main.centerY + 300,
      "enter"
    )
    .setOrigin(0, 0)
    .setInteractive();
  }

  createText() {

    this.title = "New Game";
    this.add.text(
      //this.cameras.main.centerX - 100,
      this.offsetX + source.cellWidth * 6,
      this.cameras.main.centerY - 430,
      this.title,
      {
        font: "36px NautilusPompilius",
        fill: "#0000ff",
      }
    );
  }

  createServiceButtons() {
    let style = {
      font: " 26px NautilusPompilius",
      fill: "#F30C0C",
    };

    this.buttonMenu = this.add
    .sprite(
      this.cameras.main.centerX - 50,
      this.cameras.main.centerY - 430,
      "buttonMenu"
    )
    .setOrigin(0, 0)
    .setInteractive({ cursor: "pointer" });


    this.buttonX = this.add
      .text(
        this.cameras.main.centerX - 470 ,
        this.cameras.main.centerY - 365,
        "your move",
        style
      )
      .setOrigin(0.5)
      .setInteractive({ cursor: "pointer" });

    this.buttonO = this.add
      .text(
        this.cameras.main.centerX - 160,
        this.cameras.main.centerY - 365,
        "computer's move",
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
  }

  onCellClicked(pointer, cell) {
    if (!this.isFinish && cell && cell.name === false && cell.y >= this.cells[0].y) {
      this.Pointer.destroy();
      //для крестика "обесцвечиваем" предыдущий нолик
      if (this.store.length % 2 == 0) {
        if (this.store.length > 0) {
          this.add
            .sprite(this.store.at(-1).x, this.store.at(-1).y, "img20")
            .setOrigin(0, 0);
        }
        this.add.sprite(cell.x, cell.y, "img1").setOrigin(0, 0);
        cell.name = 1;
        this.cellsR.push(cell);
      } else {
        //для нолика "обесцвечиваем" предыдущий крестик
        if (this.store.length % 2) {
          this.add
            .sprite(this.store.at(-1).x, this.store.at(-1).y, "img10")
            .setOrigin(0, 0);
        }

        this.add.sprite(cell.x, cell.y, "img2").setOrigin(0, 0);
        cell.name = 0;
        this.cellsGA.push(cell);
      }
      this.store.push(cell);
      this.createPointer();
      if (this.store.length > 1 && !this.isFinish) {
        this.Pointer.x = this.store.at(-2).x;
      this.Pointer.y = this.store.at(-2).y;
      }
      
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
    let additiveX = 0;
    let correctionY;
    let additiveY = 0;
    let indexPosition;

    if (this.store.at(-1).x < this.cells[0].x + 4 * source.cellWidth) {
      correctionX = 1;
      additiveX = 1;
    } else if (
      this.store.at(-1).x >
      this.cells.at(-1).x - 4 * source.cellWidth
    ) {
      correctionX = -1;
      additiveX = 1;
    }
    if (
      this.store.at(-1).y <
      this.cells[0].y + Math.ceil(source.rows / 2) * source.cellHeight
    ) {
      correctionY = 1;
    } else correctionY = -1;
    if (this.store.at(-1).y < this.cells[0].y + 3 * source.cellHeight) {
      additiveY = source.cols;
    } else if ( this.store.at(-1).y > this.cells.at(-1).y - 3 * source.cellWidth) {
      additiveY = source.cols;
    }

    if (this.store.length === 1 && !this.btn0WasPressed) {
      indexPosition =
        this.store.at(-1).id + correctionY * (source.cols + additiveY) + correctionX * (1 + additiveX);
      this.onCellClicked(this, this.cells[indexPosition]);
    } else this.chooseStepGA();
  }

  chooseStepGA() {  
    //this.lastStep = [this.store.at(-1)];
    this.cellsFieldGA = []; // массив возможных ходов АИ
    this.sampleGA = []; // массив лучших ходов (по w) АИ
    this.cellsFieldR = []; // массив возможных ходов игрока
    this.sampleR = []; // массив лучших ходов (по z) игрока
    this.testKitLastMovesR = [];// набор тестов для сделанных ходов игрока
    this.testKitGA = []; // набор тестов для возможных ходов АИ
    this.testKitR = []; // набор тестов для возможных ходов игрока
    //набор тестов:
    //0-й эл. - корневая ячейка + 4 тестовых массива

    if (
      //this.store.length >= 2 &&
      !this.btn0WasPressed
      /*  && this.store[this.store.length-1].name === 1*/
    ) {    

      //  console.log(this.cellsR);
      //  console.log(this.cellsGA);

      //Собираем все свободные ячейки возможных ходов ИА для создания проверочных массивов в this.cellsFieldGA
      this.createCellsField(this.cellsGA, this.cellsFieldGA);
      //Для противника в cellsFieldR
      this.createCellsField(this.cellsR, this.cellsFieldR);

      //console.log(this.cellsFieldGA);
      //console.log(cellsFieldR);
      /**/
      //Создаем массивы testKit(в каждом: тестируемая ячейка и 4 массива - гориз., верт. и диагон-е)
      // для последнего хода и каждой ячейки cellsField(для сравнения с шаблонами)
      this.createTestKit(this.testKitLastMovesR, this.cellsR);
      this.createTestKit(this.testKitGA, this.cellsFieldGA);
      this.createTestKit(this.testKitR, this.cellsFieldR);

      // console.log(this.testKitGA);
      //console.log(testKitR);

      // Определяем вес возможных ходов в атаке АИ.
      this.getWeightField(this.testKitLastMovesR, this.template_X);
      this.getWeightField(this.testKitR, this.template_X);
      this.getWeightField(this.testKitGA, this.template_O);

      //============== Массив (this.sampleGA) 'лучших' возможных ходов АИ === start =============
      this.getBestAttackGA();
      this.getBestAttackR();

      //====================== end ====================================================
      //============ Выбираем ячейку из this.cellsR с максимальным z =================
      this.maxAttackMadeMovesR; // номер выбранной ячейки в массиве this.cellsR
     let Max = 0;
      if (this.cellsR.length >= 2) {
        //Phaser.Utils.Array.Shuffle(this.cellsR);
        for (let i = 0; i < this.cellsR.length; i++) {
          if (this.cellsR[i].z > Max) {
            Max = this.cellsR[i].z;
            this.maxAttackMadeMovesR = i;
          } else this.maxAttackMadeMovesR = 0;
        } 
      }
    }
      //=============================== end =========================================
      if (this.cellsR.length && this.sampleR.length && this.maxAttackMadeMovesR >= 0) {
        console.log(this.sampleGA[0].w + " " + this.sampleGA[0].id);
        console.log(this.sampleR[0].z + " " + this.sampleR[0].id);
        console.log(this.cellsR[this.maxAttackMadeMovesR].z + " " + this.sampleR[0].id);        
      }
      console.log("======================================= ");
    //============= АИ ходит вторым. Выбор хода ====== start ===========
    if (this.store.at(-1).name === 1) {

       if (this.sampleGA[0].w >= this.template_X[2].attackWeight || // 5!

         (this.sampleGA[0].w >= this.template_X[4].attackWeight + this.template_X[10].attackWeight) && //закр.4 + откр.3
          this.cellsR[this.maxAttackMadeMovesR].z < (this.template_X[4].protectionWeight || //закр.4
          this.sampleR[0].z < this.template_X[3].protectionWeight) || //откр.4

        (this.sampleGA[0].w >= this.template_X[10].attackWeight &&  //откр.3
          this.cellsR[this.maxAttackMadeMovesR].z < this.template_X[10].protectionWeight &&  // откр.3
          this.sampleR[0].z < this.template_X[5].protectionWeight + this.template_X[10].protectionWeight) || //закр.4 + откр.3

         this.cellsR[this.maxAttackMadeMovesR].z <= this.template_X[20].protectionWeight)  
        {
        console.log("атака");
        this.onCellClicked(this, this.cells[this.sampleGA[this.bestGA].id]);
      } else {
        console.log("защита");
        this.onCellClicked(this, this.cells[this.sampleR[this.bestR].id]);
      }
    }
  }
    //=========================== end ===================================

  getBestAttackGA(){    
    let index;
    let field = this.cellsFieldGA.slice();
    let max;
    for (let i = 0; i < 3; i++) {
      let max = 0;
      for (let j = 0; j < field.length; j++) {
        if (field[j].w > max) {
          max = field[j].w;
          index = j;
        }
      }
      this.sampleGA.push(field[index]);
      field.splice(index, 1);
    }

    this.bestGA; // id выбранной ячейки
    max = 0;
    for (let i = 0; i < this.sampleGA.length; i++) {
      if (this.sampleGA[i].data > max) {
        max = this.sampleGA[i].data;
        this.bestGA = i;
      }
    }
  };

  getBestAttackR() {
    let index;
    let field = this.cellsFieldR.slice();
    let max = 0;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < field.length; j++) {
        if (field[j].z > max) {
          max = field[j].z;
          index = j;
        }
      }
        if (max > 0) { 
          this.sampleR.push(field[index]);       
      field.splice(index, 1);}
      }
    
    
    this.bestR = 0; // id выбранной ячейки
    max = 0;
    console.log(this.sampleR)
    for (let i = 0; i < this.sampleR.length; i++) {
      
      if (this.sampleR.length > 0 && this.sampleR[i].z > max) { 
        max = this.sampleR[i].z;
        
        this.bestR = i;
      }
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
      } else if (TEST === this.testKitLastMovesR) {
        this.testKitLastMovesR[i][0].z = 0;
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
                } else if (TEST === this.testKitLastMovesR) {
                  this.testKitLastMovesR[i][0].z +=
                    TEMPLATE[k].protectionWeight;
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
      if (TEST !== this.testKitLastMovesR && TEST !== this.testKitLastMovesGA) {
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
    this.buttonMenu.on("pointerdown", this.ReturnStart, this);
    this.btnLeft.on("pointerdown", this.MoveLeft, this);
    this.btnRight.on("pointerdown", this.MoveRight, this);
    this.btnUp.on("pointerdown", this.MoveUp, this);
    this.btnDown.on("pointerdown", this.MoveDown, this);
    this.btnEnter.on("pointerdown", this.MoveEnter, this);
  }

  ActionButtonX() {
    this.store.length = 0;
    this.createCells();
    this.btn0WasPressed = false;
    this.isFinish = false;
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
  ReturnStart() {
    this.scene.sleep('UIScene');
    this.scene.switch('Start');
  }  
  MoveLeft(){
    if (this.Pointer.x > this.cells[0].x && !this.isFinish) {
      this.Pointer.x -= source.cellWidth;
    }    
  }
  MoveRight(){
    if (this.Pointer.x < this.cells.at(-1).x && !this.isFinish ) {
      this.Pointer.x += source.cellWidth;
    } 
  }
  MoveUp(){
    if (this.Pointer.y > this.cells[0].y && !this.isFinish ) {
      this.Pointer.y -= source.cellHeight;
    } 
  }
  MoveDown(){
    if (this.Pointer.y < this.cells.at(-1).y && !this.isFinish ) {
      this.Pointer.y += source.cellHeight;
    } 
  }
  MoveEnter(){
    let pos = source.cols * (this.Pointer.y - this.cells[0].y) / source.cellHeight +
    (this.Pointer.x - this.cells[0].x) / source.cellWidth;
    this.onCellClicked(this, this.cells[pos]);
  }

  getCellsPositions() {
    let positions = [];
    //let offsetX = (config.width - source.cellWidth * source.cols)/2;
      this.offsetX = this.cameras.main.centerX - source.cellWidth * source.cols
    let offsetY =
      (config.height - source.cellHeight * source.rows) / 2 -
      source.cellHeight;

    for (let row = 0; row < source.rows; row++) {
      for (let col = 0; col < source.cols; col++) {
        positions.push({
          x: this.offsetX + col * source.cellWidth,
          y: offsetY + row * source.cellHeight,
        });
      }
    }
    return positions;
  }
}

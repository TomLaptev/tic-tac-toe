export default class Arrays {
  constructor() {}

  createArrays(param1, param2, param3) {
    //====== Создаем массивы для нажатой ячейки param1==========
    this.arr1 = []; //горизонтальный массив
    this.arr2 = []; //вертикальный массив
    this.arr3 = []; //диагон. массив (лево-верх -> право-низ)
    this.arr4 = []; //диагон. массив (право-верх -> лево-низ)

    for (let i = 0; i < param2.length; i++) {
      if (param2[i].x == param1.x && param2[i].y == param1.y) {
        //Присваиваем открытым ячейкам значения крестик или нолик
        param2[i].name = param3[param3.length - 1].texture.key;
      }

      /* param3 - массив с нажатыми ячейками
        param1.x, param1.y - координаты нажатой ячейки
        param3[i].texture.key - тип фигуры в ячейке массива с нажатыми ячейками
        param2[i].name = false - ячейка свободна
        param2[i].name = img1 - крестик
        param2[i].name = img2 - нолик */

      //Заполняем массивы ячейками массива param2 в заданном диапазоне

      // Для массива arr1
      if (
        param2[i].x >= param1.x - 4 * param1.width &&
        param2[i].x <= param1.x + 4 * param1.width &&
        param2[i].y == param1.y
      ) {
        this.arr1.push(param2[i]);
      }
      // Для массива arr2
      if (
        param2[i].y >= param1.y - 4 * param1.height &&
        param2[i].y <= param1.y + 4 * param1.height &&
        param2[i].x == param1.x
      ) {
        this.arr2.push(param2[i]);
      }
      // Для массива arr3
      if (
        param2[i].x >= param1.x - 4 * param1.width &&
        param2[i].x <= param1.x + 4 * param1.width &&
        param2[i].x - param2[i].y == param1.x - param1.y
      ) {
        this.arr3.push(param2[i]);
      }
      // Для массива arr4
      if (
        param2[i].x >= param1.x - 4 * param1.width &&
        param2[i].x <= param1.x + 4 * param1.width &&
        param2[i].x + param2[i].y == param1.x + param1.y
      ) {
        this.arr4.push(param2[i]);
      }
    }

/*       //===================================================================================
    // При ходе крестиков   ==== arr1 =====
    // заменяем крестики-нолики-свободные ячейки на
    // 1 - 7 - 0
    for (let i = 0; i < this.arr1.length; i++) {
      if (param1.name == "img1") {
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
      // 1 - 7 - 0
      if (param1.name == "img2") {
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
    // 1 - 7 - 0
   for (let i = 0; i < this.arr2.length; i++) {
      if (param1.name == "img1") {
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
      if (param1.name == "img2") {
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
    // 1 - 7 - 0
    for (let i = 0; i < this.arr3.length; i++) {
      if (param1.name == "img1") {
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
      if (param1.name == "img2") {
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
    // 1 - 7 - 0
    for (let i = 0; i < this.arr4.length; i++) {
      if (param1.name == "img1") {
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
      if (param1.name == "img2") {
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
  */ 

    this.Step = Math.ceil(param3.length / 2);

    return this.arr1, this.arr2, this.arr3, this.arr4, this.Step;
  }
}

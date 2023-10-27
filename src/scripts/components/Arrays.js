export default class Arrays {
  constructor() {}

  createArrays(param1, param2, param3) {
    //====== Создаем массивы для нажатой ячейки param1==========
    this.arr1 = []; //горизонтальный массив
    this.arr2 = []; //вертикальный массив
    this.arr3 = []; //диагон. массив (лево-верх -> право-низ)
    this.arr4 = []; //диагон. массив (право-верх -> лево-низ)
    this.arraysCell = [this.arr1, this.arr2, this.arr3, this.arr4]; //общий массив

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

    this.Step = Math.ceil(param3.length / 2);
  }
}

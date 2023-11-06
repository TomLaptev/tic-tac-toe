export default class Arrays {
  constructor(param1, param2) {
    this.cell = param1;
    this.cells = param2;
  }
  createArrays() {
    //====== Создаем массивы для нажатой ячейки param1==========
    this.arr1 = []; //горизонтальный массив
    this.arr2 = []; //вертикальный массив
    this.arr3 = []; //диагон. массив (лево-верх -> право-низ)
    this.arr4 = []; //диагон. массив (право-верх -> лево-низ)
    this.arraysCell = [this.cell, this.arr1, this.arr2, this.arr3, this.arr4]; //общий массив

    for (let i = 0; i < this.cells.length; i++) {
      //Заполняем массивы ячейками массива param2 в заданном диапазоне
      // Для массива arr1
      if (
        this.cells[i].x >= this.cell.x - 4 * this.cell.width &&
        this.cells[i].x <= this.cell.x + 4 * this.cell.width &&
        this.cells[i].y == this.cell.y
      ) {
        this.arr1.push(this.cells[i]);
      }
      // Для массива arr2
      if (
        this.cells[i].y >= this.cell.y - 4 * this.cell.height &&
        this.cells[i].y <= this.cell.y + 4 * this.cell.height &&
        this.cells[i].x == this.cell.x
      ) {
        this.arr2.push(this.cells[i]);
      }
      // Для массива arr3
      if (
        this.cells[i].x >= this.cell.x - 4 * this.cell.width &&
        this.cells[i].x <= this.cell.x + 4 * this.cell.width &&
        this.cells[i].x - this.cells[i].y == this.cell.x - this.cell.y
      ) {
        this.arr3.push(this.cells[i]);
      }
      // Для массива arr4
      if (
        this.cells[i].x >= this.cell.x - 4 * this.cell.width &&
        this.cells[i].x <= this.cell.x + 4 * this.cell.width &&
        this.cells[i].x + this.cells[i].y == this.cell.x + this.cell.y
      ) {
        this.arr4.push(this.cells[i]);
        
      }
    }
    
    return this.arraysCell;
  }
}

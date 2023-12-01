import Cell from '../components/Cell';
import { Images } from '../utils/const';
import { default as storage } from '../store';
import Board from '../components/Board';
import GameAlgoritm from '../components/GA';
import GameSceneControl from '../components/GameSceneControl';

export class GameScene extends Phaser.Scene {
	BOARD: Board = null;
	GA: GameAlgoritm = null;
	CONTROL: GameSceneControl = null;	
	cells: Cell[] = [];
	pointer: any;
	btn0WasPressed: boolean = false;
	isRu: boolean; 
	constructor() {
		super({
			key: 'Game',
		});
	}

	create(): void {
		this.createBackground();
		this.BOARD = new Board(this);
		this.BOARD.drawBoard();
		this.createPointer();
		this.CONTROL = new GameSceneControl(this)
		this.GA = new GameAlgoritm(this)

		// this.templX = templateX
		// this.templZero = templateZero
		this.isRu = storage.language !== 'ru';
	}

	createBackground(): void {
		if (window.innerWidth > window.innerHeight) {
			this.add.sprite(0, 0, Images.BACKGROUND_H).setOrigin(0, 0);
		} else this.add.sprite(0, 0, Images.BACKGROUND_V).setOrigin(0, 0);
	}

	createPointer() {
			this.pointer = this.add
				.sprite(
					(this.cells[0].x + this.cells.at(-1).x) / 2,
					(this.cells[0].y + this.cells.at(-1).y) / 2,
					Images.POINTER
				)
				.setOrigin(0, 0);
		
	}

	


	
}
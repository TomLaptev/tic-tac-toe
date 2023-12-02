import { GameConfig, Source } from '../GameConfig';
import Button from '../components/Button';
import { Images } from '../utils/const';
import store from '../store';

export class StartScene extends Phaser.Scene {
	topOpenButton: Button;
	lowerOpenButton: Button;
	topHiddenButton: Button;
	lowerHiddenButton: Button;
	topTitle: Button;
	backButton: Button;
	playButton: Button;
	isRu: boolean;
	isSound: boolean;
	isChoosedButton: boolean;
	langButton: Button;
	soundButton: Button;

	constructor() {
		super({
			key: 'Start',
		});
	}

	create(): void {
		this.isRu = store.language === 'ru';
		this.isSound = store.sound === '';
		this.createBackground();
		this.createNameGame();
		this.createMainMenu();
	};

	createBackground() {
		if (window.innerWidth > window.innerHeight) {
			this.add.sprite(0, 0, Images.BACKGROUND_H).setOrigin(0, 0);
		} else this.add.sprite(0, 0, Images.BACKGROUND_V).setOrigin(0, 0);

		this.add
			.sprite(
				this.cameras.main.centerX + 70,
				this.cameras.main.centerY - 250,
				Images.NEPTUNE
			)
			.setOrigin(0, 0);
		this.add
			.sprite(
				this.cameras.main.centerX - 70,
				this.cameras.main.centerY - 30,
				Images.BOARD
			)
			.setOrigin(0, 0);
	}
	
	createNameGame() {
		this.topTitle = new Button(
			this,
			this.cameras.main.centerX - 0,
			this.cameras.main.centerY - 350,
			null,
			null,
			'#0000ff',
			null,
			'NautilusPompilius',
			36,
			this.isRu ? 'Большие крестики-нолики у Нептуна' : 'Big tic-tac-toe near Neptune',
			null
		);
	}

	createMainMenu() {
		this.topOpenButton = new Button(
			this,
			this.cameras.main.centerX - 105,
			this.cameras.main.centerY - 250,
			null,
			null,
			'#0000ff',
			Images.BUTTON,
			'NautilusPompilius',
			28,
			this.isRu ? 'Игра с компьютером' : 'Game with computer',
			() => {
				this.getDropMenu();
			}
		);

		this.lowerOpenButton = new Button(
			this,
			this.cameras.main.centerX - 105,
			this.cameras.main.centerY - 100,
			null,
			null,
			'#0000ff',
			Images.BUTTON,
			'NautilusPompilius',
			28,
			this.isRu ? 'Игра онлайн' : 'Play online',
			() => {

			}
		);

		this.langButton = new Button(
			this,
			this.cameras.main.centerX - 180,
			this.cameras.main.centerY + 300,
			null,
			null,
			'#0000ff',
			Images.BUTTON_LANG,
			'NautilusPompilius',
			28,
			this.isRu ? '    Ru' : '   En',
			() => {
				if (store.language === 'eng') {
					store.language = 'ru'
					localStorage.setItem('lang', 'ru')
					//this.isRu = true;
				} else {
					store.language = 'eng'
					localStorage.setItem('lang', 'eng')
					this.isRu = false;
				}
				this.scene.start("Start");
			}
		);

		this.createSoundButton();
	}

	createSoundButton(){
		let data: string = localStorage.getItem('sound');
		this.isSound = data === 'x';
		this.soundButton = new Button(
			this,
			this.cameras.main.centerX - 40,
			this.cameras.main.centerY + 300,
			null,
			null,
			'#0000ff',
			Images.BUTTON_SOUND,
			'Verdana',
			18,
			data ? '' : '      X',
			() => {
				if (data === 'x') {
					localStorage.setItem('sound', '')
				} else {
					localStorage.setItem('sound', 'x')
				}
				this.soundButton.container.destroy();
				this.createSoundButton();
			}
			);
	}

	getDropMenu() {
		this.lowerOpenButton.container.setVisible(false);
		let hiddenSubtitle: Button, hiddenTopText: Button, hiddenLowerText: Button;

		hiddenSubtitle = new Button(
			this,
			this.cameras.main.centerX - 130,
			this.cameras.main.centerY - 130,
			null,
			null,
			'#0000ff',
			null,
			'NautilusPompilius',
			30,
			this.isRu ? '           Выбери уровень сложности:' : 'Select difficulty level',
			null
		);

		hiddenTopText = new Button(
			this,
			this.cameras.main.centerX - 210,
			this.cameras.main.centerY - 50,
			null,
			null,
			'#0000ff',
			null,
			'NautilusPompilius',
			30,
			this.isRu ? ' Новичок' : 'Newbie',
			null
		);

		hiddenLowerText = new Button(
			this,
			this.cameras.main.centerX - 210,
			this.cameras.main.centerY + 5,
			null,
			null,
			'#0000ff',
			null,
			'NautilusPompilius',
			30,
			this.isRu ? '     Любитель' : 'Amateur',
			null
		);
		this.createHiddenButton()

		this.backButton = new Button(
			this,
			this.cameras.main.centerX - 105,
			this.cameras.main.centerY + 80,
			null, null, null,
			Images.BUTTON_HOME,
			null, null, null,
			() => {
				this.returnStart()
			}
		);

		this.playButton = new Button(
			this,
			this.cameras.main.centerX - 200,
			this.cameras.main.centerY + 80,
			null, null, null,
			Images.PLAY,
			null, null, null,
			() => {
				this.startGame1()
			}
		);

	}

	createHiddenButton() {
		let data: string = localStorage.getItem('button');
		this.isChoosedButton = data === '';

		this.topHiddenButton = new Button(
			this,
			this.cameras.main.centerX - 70,
			this.cameras.main.centerY - 60,
			null,
			null,
			'#00ff00',
			Images.BUTTON_FREE,
			'Verdana',
			20,
			!this.isChoosedButton ? '' : 'V',
			() => {
				if (data === '') {
					localStorage.setItem('button', 'v')
				} else {
					localStorage.setItem('button', '')
				}
				this.isChoosedButton ? this.isChoosedButton = false : this.isChoosedButton = true;
				this.topHiddenButton.container.destroy();
				this.topHiddenButton.container.destroy();
				this.createHiddenButton()
			}
		);

		this.lowerHiddenButton = new Button(
			this,
			this.cameras.main.centerX - 70,
			this.cameras.main.centerY - 5,
			null,
			null,
			'#00ff00',
			Images.BUTTON_FREE,
			'Verdana',
			20,
			!this.isChoosedButton ? 'V' : '',
			() => {
				if (data === '') {					
					localStorage.setItem('button', 'v')		
				} else {
					localStorage.setItem('button', '')
				}
				this.topHiddenButton.container.destroy();
				this.topHiddenButton.container.destroy();
				this.createHiddenButton()
			}
		);
	}

	startGame1() {
		this.scene.sleep("UIScene");
		this.scene.start("Game");
	}
	startGame2() {
		this.scene.sleep("UIScene");
		this.scene.start("Game");
	}
	returnStart() {
		//this.scene.sleep("UIScene");
		this.scene.start("Start");
	}
}
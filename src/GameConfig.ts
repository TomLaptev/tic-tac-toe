import { BootScene } from './scenes/BootScene';
import { StartScene } from './scenes/StartScene';
import { GameScene } from './scenes/GameScene';

export const GameConfig: Phaser.Types.Core.GameConfig = {
	type: Phaser.AUTO,
	scene: [BootScene,  StartScene, GameScene],
	width:  0,
	height: 0,
};

if (window.innerWidth < window.innerHeight) {
	GameConfig.width = 610;
	GameConfig.height = 1720;
	GameConfig.scale = {
		mode: Phaser.Scale.WIDTH_CONTROLS_HEIGHT,
		autoCenter: Phaser.Scale.CENTER_BOTH,
	};
} else {
	GameConfig.width = 1920;
	GameConfig.height = 810;
	GameConfig.scale = {
		mode: Phaser.Scale.HEIGHT_CONTROLS_WIDTH,
		autoCenter: Phaser.Scale.CENTER_BOTH,
	}
}

export const Source:any = { 
	rows: 15,
	cols: 15,
	cellWidth: 40,
	cellHeight: 40,
};


import Phaser from "phaser";
import bgJpg from "../../assets/sprites/background.jpg";


export default class BootScene extends Phaser.Scene {
  constructor() {
     super("Boot");
  }

   preload() {
    this.load.image('bg', bgJpg)        
  };

   create() {
       this.add.sprite(0, 0, "bg").setOrigin(0, 0);
       this.scene.start('Preload');
      
  }
}

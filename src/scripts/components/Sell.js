export default class Sell extends Phaser.GameObjects.Sprite {
  constructor(scene, position) {
    super(scene, position.x, position.y, "img");
    this.scene = scene;
    this.setOrigin(0, 0);
    this.scene.add.existing(this);
    this.setInteractive({cursor: 'pointer'});
  }

  hideSell() {
    this.scene.tweens.add({
      targets: this,
      scaleX: 0,
      ease: "Linear",
      duration: 0,
     
    });
  }

 
}
import Phaser from "phaser";

export default class StartScene extends Phaser.Scene {
  constructor() {
    super("Start");
    this.isRu = true;
  }
  create() {
    this.createBackground();
    this.createButtons();
    this.createText();
    this.setEvents();
    
  }

  createBackground() {
    this.add.sprite(0, 0, "background").setOrigin(0, 0);
  this.add
      .sprite(
        // this.cameras.main.centerX + 70,
        // this.cameras.main.centerY - 300,
        this.cameras.main.centerX + 70,
        this.cameras.main.centerY - 150,
        "Neptune"
      )
      .setOrigin(0, 0);

    this.add
      .sprite(
        // this.cameras.main.centerX - 50,
        // this.cameras.main.centerY - 50,
        this.cameras.main.centerX - 70,
        this.cameras.main.centerY + 70,
        "board"
      )
      .setOrigin(0, 0);
  }
  createButtons() {
    this.btn1 = this.add
      .sprite(
        this.cameras.main.centerX - 300,
        this.cameras.main.centerY - 250,
        "button"
      )
      .setOrigin(0, 0)
      .setInteractive({ cursor: "pointer" });

    this.btn2 = this.add
      .sprite(
        this.cameras.main.centerX - 300,
        this.cameras.main.centerY - 100,
        "button"
      )
      .setOrigin(0, 0)
      .setInteractive({ cursor: "pointer" });
  }

  createText() {
    let title;
    if (this.isRu) {
      title = "Большие крестики-нолики у Нептуна";
      this.button1 = "Игра с компьютером";
      this.button2 = "Игра онлайн";
      
    } else {
      title = "Big tic-tac-toe near Neptune";
      this.button1 = "Game with computer";
      this.button2 = "  Play online";
    }

      this.add.text(
      this.cameras.main.centerX - 300,
      this.cameras.main.centerY - 350,
      title,
      {
        font: "36px NautilusPompilius",
        fill: "#0000ff",
      }
    );

    this.Btn1Text = this.add.text(
      this.cameras.main.centerX - 260,
      this.cameras.main.centerY - 220,
      this.button1,
      {
        font: "28px NautilusPompilius",
        fill: "#0000ff",
      }
    );

    this.Btn2Text = this.add.text(
      this.cameras.main.centerX - 200,
      this.cameras.main.centerY - 70,
      this.button2,
      {
        font: "28px NautilusPompilius",
        fill: "#0000ff",
      }
    );
  }

  setEvents() {
    this.btn1.on("pointerdown", this.startGame, this);
  }

  startGame() {
    this.btn2.destroy();
    this.Btn2Text.destroy();
    this.createTextdifficultyLevel(); 
  }
  
  createTextdifficultyLevel(){
    let title1;
    let title2;
    let title3;
    if (this.isRu) {
      title1 = "Выбери уровень сложности:";      
      title2 = "Новичок";      
      title3 = "Любитель";      
    } else {
      title1 = "Select difficulty level:";
      title2 = "Newbie";
      title3 = "Amateur";
    } 
    this.add.text(
      this.cameras.main.centerX - 300,
      this.cameras.main.centerY - 130,
      title1,
      {
        font: "30px NautilusPompilius",
        fill: "#0000ff",
      }
    );

    this.Btn3Text = this.add.text(
      this.cameras.main.centerX - 300,
      this.cameras.main.centerY - 75,
      title2,
      {
        font: "28px NautilusPompilius",
        fill: "#0000ff",
      }
    );
    this.Btn4Text = this.add.text(
      this.cameras.main.centerX - 300,
      this.cameras.main.centerY - 25,
      title3,
      {
        font: "28px NautilusPompilius",
        fill: "#0000ff",
      }
    );

    this.btn3 = this.add
    .sprite(
      this.cameras.main.centerX - 130,
      this.cameras.main.centerY - 80,
      "buttonLevelSelection"
    )
    .setOrigin(0, 0)
    .setInteractive({ cursor: "pointer" });

    this.btn4 = this.add
    .sprite(
      this.cameras.main.centerX - 130,
      this.cameras.main.centerY - 30,
      "buttonLevelSelection"
    )
    .setOrigin(0, 0)
    .setInteractive({ cursor: "pointer" });

    this.btn5 = this.add
    .sprite(
      this.cameras.main.centerX - 135,
      this.cameras.main.centerY + 30,
      "buttonHome"
    )
    .setOrigin(0, 0)
    .setInteractive({ cursor: "pointer" });

    this.btn3.on("pointerdown", this.startGame1, this);
    this.btn4.on("pointerdown", this.startGame2, this);
    this.btn5.on("pointerdown", this.returnStart, this);
    
  }

  startGame1() {
    this.scene.sleep('UIScene');
    this.scene.start("Game"); 
  }
  startGame2() {
    this.scene.sleep('UIScene');
    this.scene.start("Game"); 
  }
  returnStart() {
    this.scene.sleep('UIScene');
    this.scene.start("Start"); 
  }

}

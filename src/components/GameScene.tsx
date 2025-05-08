import Phaser from "phaser";
import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { completeLevel } from "../store/gameSlice";

interface GameObjects {
  player: Phaser.Physics.Arcade.Sprite;
  stars: Phaser.Physics.Arcade.Group;
  platforms: Phaser.Physics.Arcade.StaticGroup;
  scoreText: Phaser.GameObjects.Text;
}

class Level1 extends Phaser.Scene {
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private objects!: GameObjects;
  private score = 0;
  private isCompleted = false;

  preload() {
    this.load.image("sky", "assets/sky.png");
    this.load.image("ground", "assets/platform.png");
    this.load.image("star", "assets/star.png");
    this.load.spritesheet("dude", "assets/dude.png", {
      frameWidth: 32,
      frameHeight: 48,
    });
  }

  create() {
    this.objects = {
      player: this.createPlayer(),
      platforms: this.createPlatforms(),
      stars: this.createStars(),
      scoreText: this.createScoreText(),
    };

    this.setupPhysics();
    this.setupControls();
    this.setupEditorAPI();
  }

  private createPlayer(): Phaser.Physics.Arcade.Sprite {
    const player = this.physics.add.sprite(100, 450, "dude");
    player.setBounce(0.2);
    player.setCollideWorldBounds(true);

    this.anims.create({
      key: "left",
      frames: this.anims.generateFrameNumbers("dude", { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "turn",
      frames: [{ key: "dude", frame: 4 }],
      frameRate: 20,
    });

    this.anims.create({
      key: "right",
      frames: this.anims.generateFrameNumbers("dude", { start: 5, end: 8 }),
      frameRate: 10,
      repeat: -1,
    });

    return player;
  }

  private createPlatforms(): Phaser.Physics.Arcade.StaticGroup {
    const platforms = this.physics.add.staticGroup();
    platforms.create(400, 568, "ground").setScale(2).refreshBody();
    platforms.create(600, 400, "ground");
    platforms.create(50, 250, "ground");
    platforms.create(750, 220, "ground");
    return platforms;
  }

  private createStars(): Phaser.Physics.Arcade.Group {
    const stars = this.physics.add.group({
      key: "star",
      repeat: 11,
      setXY: { x: 12, y: 0, stepX: 70 },
    });

    stars.children.iterate((child) => {
      const star = child as Phaser.Physics.Arcade.Sprite;
      star.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
      return null;
    });

    return stars;
  }

  private createScoreText(): Phaser.GameObjects.Text {
    return this.add.text(16, 16, "Собрано звезд: 0", {
      fontSize: "32px",
      color: "#000",
    });
  }

  private setupPhysics() {
    this.physics.add.collider(this.objects.player, this.objects.platforms);
    this.physics.add.collider(this.objects.stars, this.objects.platforms);

    this.physics.add.overlap(
      this.objects.player,
      this.objects.stars,
      (
        player: Phaser.GameObjects.GameObject,
        star: Phaser.GameObjects.GameObject
      ) => {
        const sprite = star as Phaser.Physics.Arcade.Sprite;
        sprite.disableBody(true, true);

        this.score += 1;
        this.objects.scoreText.setText(`Собрано звезд: ${this.score}`);

        if (this.objects.stars.countActive(true) === 0) {
          this.objects.stars.children.iterate((child) => {
            const c = child as Phaser.Physics.Arcade.Sprite;
            c.enableBody(true, c.x, 0, true, true);
            return null;
          });
        }

        if (this.score >= 5 && !this.isCompleted) {
          this.isCompleted = true;
          (window as any).levelCompleted = true;
        }
      },
      undefined,
      this
    );
  }

  private setupControls() {
    this.cursors = this.input.keyboard!.createCursorKeys();
  }

  private setupEditorAPI() {
    (window as any).gameAPI = {
      moveLeft: () => {
        this.objects.player.setVelocityX(-160);
        this.objects.player.anims.play("left", true);
      },
      moveRight: () => {
        this.objects.player.setVelocityX(160);
        this.objects.player.anims.play("right", true);
      },
      jump: () => {
        if (this.objects.player.body!.touching.down) {
          this.objects.player.setVelocityY(-330);
        }
      },
      getScore: () => this.score,
    };
  }

  update() {
    if (this.cursors.left.isDown) {
      this.objects.player.setVelocityX(-160);
      this.objects.player.anims.play("left", true);
    } else if (this.cursors.right.isDown) {
      this.objects.player.setVelocityX(160);
      this.objects.player.anims.play("right", true);
    } else {
      this.objects.player.setVelocityX(0);
      this.objects.player.anims.play("turn");
    }

    if (this.cursors.up.isDown && this.objects.player.body!.touching.down) {
      this.objects.player.setVelocityY(-330);
    }
  }
}

interface GameSceneProps {
  level: number;
}

export const GameScene = ({ level }: GameSceneProps) => {
  const gameContainer = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      parent: gameContainer.current!,
      physics: {
        default: "arcade",
        arcade: {
          gravity: { y: 300, x: 300 },
          debug: false,
        },
      },
      scene: [Level1],
    };

    const game = new Phaser.Game(config);

    const checkCompletion = setInterval(() => {
      if ((window as any).levelCompleted) {
        dispatch(completeLevel());
        clearInterval(checkCompletion);
      }
    }, 500);

    return () => {
      game.destroy(true);
      clearInterval(checkCompletion);
    };
  }, [level, dispatch]);

  return <div ref={gameContainer} className="game-container" />;
};

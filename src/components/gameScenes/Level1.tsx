import { RootState } from "@/store/store";
import Phaser from "phaser";
import { Toast } from "primereact/toast";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

interface GameAPI {
  enableMovement: () => void;
}

export default function Level1() {
  const { code, isStartLevel } = useSelector((state: RootState) => state.game);
  const [canMove, setCanMove] = useState(false);
  const toastCenter = useRef<Toast>(null);
  const canMoveRef = useRef(canMove);

  useEffect(() => {
    canMoveRef.current = canMove;
  }, [canMove]);

  useEffect(() => {
    if (isStartLevel) {
      const api: GameAPI = {
        enableMovement: () => setCanMove(true),
      };
      try {
        const userFunction = new Function("api", code);
        userFunction(api);
      } catch (error) {
        console.error("Ошибка выполнения кода:", error);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isStartLevel]);

  useEffect(() => {
    const game = new Phaser.Game(config);
    return () => game.destroy(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    parent: "game-container",
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      width: "55%",
      height: "50%",
    },
    physics: {
      default: "arcade",
      arcade: {
        gravity: { y: 500, x: 0 },
        debug: false,
        fixedStep: true,
      },
    },
    scene: {
      preload: preload,
      create: create,
      update: update,
    },
  };

  let player: Phaser.Physics.Arcade.Sprite;
  let cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  let keys: any;
  let platforms: Phaser.Physics.Arcade.StaticGroup;
  let horizontalSpeed = 0;
  let victory = false;
  let isTouchingWall = false;

  async function handleVictory() {
    if (victory) return;
    victory = true;

    toastCenter.current?.show({
      severity: "success",
      summary: "Победа",
      detail: "Вы прошли уровень!",
      life: 30000,
    });

    player.body?.stop();
    player.anims.stop();
    const username = sessionStorage.getItem("login");
    await fetch("http://localhost:3001/api/complete-level", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        level: 1,
      }),
    });
  }

  function preload(this: Phaser.Scene) {
    this.load.spritesheet("player_walk", "/assets/player/p1_walk/p1_walk.png", {
      frameWidth: 67,
      frameHeight: 92,
      endFrame: 11,
    });

    this.load.image("player_jump", "/assets/player/p1_jump.png");
    this.load.image("player_stand", "/assets/player/p1_stand.png");
    this.load.image("box", "/assets/tiles/box.png");
    this.load.image("background", "/assets/background/bg_castle.png");
    this.load.image("flag", "/assets/hud/flagYellowHanging.png");
  }

  function create(this: Phaser.Scene) {
    // Фон
    this.add.image(400, 200, "background").setDisplaySize(800, 600);

    // Платформы
    platforms = this.physics.add.staticGroup();
    platforms.create(400, 430, "box").setScale(2).refreshBody();
    platforms.create(200, 350, "box");
    platforms.create(600, 250, "box");

    // Анимация
    this.anims.create({
      key: "walk",
      frames: this.anims.generateFrameNumbers("player_walk", {
        start: 0,
        end: 11,
      }),
      frameRate: 12,
      repeat: -1,
    });

    // Персонаж
    player = this.physics.add.sprite(100, 450, "player_walk", 0);
    player.setScale(0.5);
    player.setCollideWorldBounds(true);
    player.setSize(50, 80); // Настройка хитбокса

    // Настройка коллайдера
    player.body?.setSize(50, 80, true);
    player.setOffset(10, 10);

    // Коллайдеры
    this.physics.add.collider(player, platforms);

    // Модифицируем коллайдер с платформами
    this.physics.add.collider(
      player,
      platforms,
      (playerCollide, platformCollide) => {
        const playerBody = (playerCollide as Phaser.Physics.Arcade.Sprite)
          .body as Phaser.Physics.Arcade.Body;
        const platform = platformCollide as Phaser.Physics.Arcade.StaticBody;

        // Определение стороны столкновения
        if (
          playerBody.right >= platform.x - platform.width / 2 &&
          playerBody.left <= platform.x + platform.width / 2
        ) {
          if (playerBody.bottom <= platform.y - platform.height / 2 + 5) {
            // Столкновение с верхом платформы
            isTouchingWall = false;
          } else {
            // Столкновение с боковой стороной
            isTouchingWall = true;
            horizontalSpeed = 0;
            player.setVelocityX(0);
          }
        }
      }
    );

    // Управление
    //@ts-ignore
    cursors = this.input.keyboard?.createCursorKeys();
    keys = this.input.keyboard?.addKeys("W,A,S,D,SPACE");

    //Флаг
    const flag: Phaser.Physics.Arcade.Sprite = this.physics.add.staticSprite(
      640,
      200,
      "flag"
    );
    flag.setScale(0.5).refreshBody();

    //Касание флага
    this.physics.add.overlap(
      player, // Первый объект
      flag, // Второй объект
      handleVictory, // Функция-обработчик
      undefined,
      this
    );
  }

  function update(this: Phaser.Scene) {
    if (victory || !canMoveRef.current) {
      player?.setVelocityX(0);
      player?.anims.stop();
      return;
    }

    const isOnGround = player.body?.blocked.down;
    const isJumping = !isOnGround && !isTouchingWall;
    const canWallJump = isTouchingWall && !isOnGround;

    // Управление движением
    if (isOnGround) {
      horizontalSpeed = 0;
      if (keys.A.isDown || cursors.left.isDown) {
        horizontalSpeed = -160;
        player.setFlipX(true);
      } else if (keys.D.isDown || cursors.right.isDown) {
        horizontalSpeed = 160;
        player.setFlipX(false);
      }
    }

    if (isTouchingWall) {
      horizontalSpeed = 0;
      player.setVelocityX(0);
    }

    player.setVelocityX(horizontalSpeed);

    // Прыжок
    if (keys.SPACE.isDown || cursors.up.isDown) {
      if (isOnGround) {
        // Обычный прыжок
        player.setVelocityY(-400);
      } else if (canWallJump) {
        // Прыжок от стены
        player.setVelocityY(-400);
        player.setVelocityX(player.flipX ? 250 : -250);
        player.setFlipX(!player.flipX);
        isTouchingWall = false;
      }
    }

    // Управление анимацией (исправленная логика)
    if (isJumping || canWallJump) {
      player.anims.stop();
      player.setTexture("player_jump");
    } else if (horizontalSpeed !== 0) {
      if (player.texture.key !== "player_walk") {
        player.setTexture("player_walk");
      }
      player.anims.play("walk", true);
    } else {
      player.anims.stop();
      player.setTexture("player_stand");
    }

    isTouchingWall = false;
  }
  return (
    <>
      <div
        id="game-container"
        className="game-container"
        style={{ height: "1000px" }}
      />
      <Toast ref={toastCenter} position="center" />
    </>
  );
}

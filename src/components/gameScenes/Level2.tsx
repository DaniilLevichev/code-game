/* eslint-disable react-hooks/exhaustive-deps */
// src/components/Level2.tsx
import { RootState } from "@/store/store";
import Phaser from "phaser";
import { Toast } from "primereact/toast";
import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";

interface GameAPI {
  physics: {
    setGravity: (x: number, y: number) => void;
  };
  world: {
    createMovingBox: (x: number, y: number, speed: number) => void;
  };
  movement: {
    enable: () => void;
  };
}

export default function Level2() {
  const { code, isStartLevel } = useSelector((state: RootState) => state.game);
  const gravityRef = useRef({ x: 0, y: 500 });
  const canMoveRef = useRef(false);
  const movingBoxesRef = useRef<Phaser.Physics.Arcade.Group>(null);
  const playerRef = useRef<Phaser.Physics.Arcade.Sprite>(null);
  const toastCenter = useRef<Toast>(null);

  // Конфигурация игры
  const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    parent: "game-container",
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      width: 800,
      height: 600,
    },
    physics: {
      default: "arcade",
      arcade: {
        gravity: { y: gravityRef.current.y, x: gravityRef.current.x },
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
  let victory = false;
  let platforms: Phaser.Physics.Arcade.StaticGroup;

  useEffect(() => {
    if (isStartLevel) {
      const api: GameAPI = {
        physics: {
          setGravity: (x, y) => {
            gravityRef.current = { x, y };
            playerRef.current?.scene.physics.world.gravity.set(x, y);
          },
        },
        world: {
          createMovingBox: (x, y, speed) => {
            const box = movingBoxesRef.current?.create(x, y, "box");
            box?.setVelocityX(speed).setCollideWorldBounds(true);
          },
        },
        movement: {
          enable: () => (canMoveRef.current = true),
        },
      };

      try {
        const userFunction = new Function("api", code);
        userFunction(api);
      } catch (error) {
        console.error("Ошибка выполнения кода:", error);
      }
    }
  }, [isStartLevel, code]);

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
    // Фон и платформы
    this.add.image(400, 300, "background").setDisplaySize(800, 600);
    movingBoxesRef.current = this.physics.add.group();
    platforms = this.physics.add.staticGroup();
    platforms.create(400, 430, "box");

    // Персонаж
    player = this.physics.add.sprite(100, 450, "player_walk", 0);
    player
      .setScale(0.5)
      .setCollideWorldBounds(true)
      .setSize(50, 80)
      .setOffset(10, 10);
    playerRef.current = player;

    // Анимации
    this.anims.create({
      key: "walk",
      frames: this.anims.generateFrameNumbers("player_walk", {
        start: 0,
        end: 11,
      }),
      frameRate: 12,
      repeat: -1,
    });

    // Управление
    cursors = this.input.keyboard!.createCursorKeys();
    keys = this.input.keyboard!.addKeys("W,A,S,D,SPACE");

    // Флаг в воздухе
    const flag = this.physics.add.staticSprite(600, 200, "flag");
    flag.setScale(0.5).refreshBody();

    // Победа при касании флага
    this.physics.add.overlap(player, flag, handleVictory);
  }

  function update(this: Phaser.Scene) {
    if (victory || !canMoveRef.current) {
      player?.setVelocityX(0);
      player?.anims.stop();
      return;
    }

    // Управление персонажем
    const isOnGround = player.body?.blocked.down;
    let horizontalSpeed = 0;

    if (isOnGround) {
      if (keys.A.isDown || cursors.left.isDown) {
        horizontalSpeed = -160;
        player.setFlipX(true);
      } else if (keys.D.isDown || cursors.right.isDown) {
        horizontalSpeed = 160;
        player.setFlipX(false);
      }
    }

    player.setVelocityX(horizontalSpeed);

    // Вертикальный прыжок
    if ((keys.SPACE.isDown || cursors.up.isDown) && isOnGround) {
      player.setVelocityY(-400);
    }

    // Анимации
    if (!isOnGround) {
      player.setTexture("player_jump");
    } else if (horizontalSpeed !== 0) {
      player.anims.play("walk", true);
    } else {
      player.setTexture("player_stand");
    }

    // Остановка коробок при столкновении
    //@ts-ignore
    movingBoxesRef.current?.children.each((box) => {
      const body = (box as Phaser.Physics.Arcade.Sprite).body!;
      if (body.blocked.right || body.blocked.left) body.velocity.set(0, 0);
    });
  }

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

  useEffect(() => {
    const game = new Phaser.Game(config);
    return () => game.destroy(true);
  }, []);

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

/* eslint-disable react-hooks/exhaustive-deps */
import { RootState } from "@/store/store";
import Phaser from "phaser";
import { Toast } from "primereact/toast";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

interface GameAPI {
  construction: {
    createPlatform: (x: number, y: number) => void;
  };
  movement: {
    enable: () => void;
  };
}

export default function Level4() {
  const { code, isStartLevel } = useSelector((state: RootState) => state.game);
  const [canMove, setCanMove] = useState(false);
  const canMoveRef = useRef(canMove);
  const platformsRef = useRef<Phaser.Physics.Arcade.StaticGroup>(null);
  const platformsCount = useRef(0);
  const toastCenter = useRef<Toast>(null);

  useEffect(() => {
    canMoveRef.current = canMove;
  }, [canMove]);

  useEffect(() => {
    if (isStartLevel) {
      // Проверка на наличие циклов в коде
      if (!/(for|while)\s*\(/.test(code)) {
        toastCenter.current?.show({
          severity: "error",
          summary: "Ошибка",
          detail: "Необходимо использовать цикл",
          life: 30000,
        });
        return;
      }

      const api: GameAPI = {
        construction: {
          createPlatform: (x, y) => {
            if (platformsCount.current >= 15) return;
            platformsRef.current?.create(x, y, "box").refreshBody();
            platformsCount.current++;
          },
        },
        movement: {
          enable: () => setCanMove(true),
        },
      };

      try {
        const userFunction = new Function("api", code);
        userFunction(api);
      } catch (error) {
        console.error("Ошибка выполнения:", error);
      }
    }
  }, [isStartLevel, code]);

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
        gravity: { x: 0, y: 800 }, // Усиленная гравитация
        debug: false,
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
  let horizontalSpeed = 0;
  let victory = false;
  let flag: Phaser.Physics.Arcade.Sprite;
  const isTouchingWall = false;

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
        level: 4,
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
    this.add.image(400, 300, "background").setDisplaySize(800, 600);

    // Платформы returnо стартовая)
    platformsRef.current = this.physics.add.staticGroup();
    platformsRef.current.create(100, 550, "box").setScale(2).refreshBody();

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

    // Персонаж
    player = this.physics.add.sprite(100, 450, "player_walk", 0);
    player
      .setScale(0.5)
      .setCollideWorldBounds(true)
      .setSize(50, 80)
      .setOffset(10, 10);

    // Флаг в труднодоступном месте
    flag = this.physics.add.staticSprite(700, 165, "flag");
    flag.setScale(0.5).refreshBody();

    // Коллайдеры
    this.physics.add.collider(player, platformsRef.current);
    this.physics.add.overlap(player, flag, handleVictory);

    // Управление
    cursors = this.input.keyboard!.createCursorKeys();
    keys = this.input.keyboard!.addKeys("W,A,S,D,SPACE");
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

    // Движение
    if (isOnGround) {
      horizontalSpeed = 0;
      if (keys.A.isDown || cursors.left.isDown) horizontalSpeed = -160;
      else if (keys.D.isDown || cursors.right.isDown) horizontalSpeed = 160;
    }

    player.setVelocityX(horizontalSpeed);

    // Прыжки
    if (keys.SPACE.isDown || cursors.up.isDown) {
      if (isOnGround) player.setVelocityY(-500);
      else if (canWallJump) {
        player.setVelocityY(-500).setVelocityX(player.flipX ? 300 : -300);
        player.setFlipX(!player.flipX);
      }
    }

    // Анимации
    if (isJumping || canWallJump) {
      player.setTexture("player_jump");
    } else if (horizontalSpeed !== 0) {
      player.anims.play("walk", true);
    } else {
      player.setTexture("player_stand");
    }
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

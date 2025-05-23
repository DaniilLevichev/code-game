/* eslint-disable react-hooks/exhaustive-deps */
// src/components/Level3.tsx
import { RootState } from "@/store/store";
import Phaser from "phaser";
import { Toast } from "primereact/toast";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

interface GameAPI {
  logic: {
    createPlatform: (x: number, y: number) => void;
    removePlatform: (x: number, y: number) => void;
    getPlayerPosition: () => { x: number; y: number } | null;
  };
  movement: {
    moveLeft: () => void;
    moveRight: () => void;
    jump: () => void;
  };
  events: {
    onComplete: (callback: () => void) => void;
  };
}

export default function Level3() {
  const { code, isStartLevel } = useSelector((state: RootState) => state.game);
  const [taskCompleted, setTaskCompleted] = useState(false);
  const platformsRef = useRef<Phaser.Physics.Arcade.StaticGroup>(null);
  const playerRef = useRef<Phaser.Physics.Arcade.Sprite>(null);
  const completeCallbackRef = useRef<() => void>(null);
  const toastCenter = useRef<Toast>(null);

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
        gravity: { x: 0, y: 500 },
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
  let targetZone: Phaser.GameObjects.Zone;

  useEffect(() => {
    if (isStartLevel) {
      const api: GameAPI = {
        logic: {
          createPlatform: (x, y) => {
            const platform = platformsRef.current?.create(x, y, "box");
            platform?.refreshBody();
          },
          removePlatform: (x, y) => {
            //@ts-ignore
            platformsRef.current?.children.each((platform) => {
              const p = platform as Phaser.Physics.Arcade.Sprite;
              if (Math.abs(p.x - x) < 10 && Math.abs(p.y - y) < 10) p.destroy();
            });
          },
          getPlayerPosition: () =>
            playerRef.current
              ? {
                  x: Math.round(playerRef.current.x),
                  y: Math.round(playerRef.current.y),
                }
              : null,
        },
        movement: {
          moveLeft: () => playerRef.current?.setVelocityX(-160),
          moveRight: () => playerRef.current?.setVelocityX(160),
          jump: () => {
            if (playerRef.current?.body?.blocked.down) {
              playerRef.current.setVelocityY(-400);
            }
          },
        },
        events: {
          onComplete: (callback) => (completeCallbackRef.current = callback),
        },
      };

      try {
        const userFunction = new Function("api", code);
        userFunction(api);
      } catch (error) {
        console.error("Execution error:", error);
      }
    }
  }, [isStartLevel, code]);

  function preload(this: Phaser.Scene) {
    this.load.spritesheet("player_walk", "/assets/player/p1_walk/p1_walk.png", {
      frameWidth: 67,
      frameHeight: 92,
      endFrame: 11,
    });
    this.load.image("box", "/assets/tiles/box.png");
    this.load.image("flag", "/assets/hud/flagYellowHanging.png");
    this.load.image("background", "/assets/background/bg_castle.png");
  }

  function create(this: Phaser.Scene) {
    this.add.image(400, 200, "background").setDisplaySize(800, 600);
    platformsRef.current = this.physics.add.staticGroup();
    platformsRef.current.create(590, 250, "box");

    player = this.physics.add
      .sprite(100, 500, "player_walk", 0)
      .setCollideWorldBounds(true)
      .setScale(0.5)
      .setSize(50, 80)
      .setOffset(10, 10);
    playerRef.current = player;

    targetZone = this.add.zone(620, 200, 50, 50);
    this.physics.add.existing(targetZone, true);
    this.add.image(600, 200, "flag").setScale(0.5);

    this.physics.add.collider(player, platformsRef.current);
    this.physics.add.overlap(player, targetZone, handleVictory);

    this.anims.create({
      key: "walk",
      frames: this.anims.generateFrameNumbers("player_walk", {
        start: 0,
        end: 11,
      }),
      frameRate: 12,
      repeat: -1,
    });
  }

  function update() {
    if (!taskCompleted && playerRef.current) {
      if (playerRef.current.body?.velocity.x === 0) {
        playerRef.current.anims.stop();
      } else {
        playerRef.current.anims.play("walk", true);
      }
    } else {
      player?.setVelocityX(0);
      player?.anims.stop();
      return;
    }
  }

  async function handleVictory() {
    if (!taskCompleted) {
      setTaskCompleted(true);
      completeCallbackRef.current?.();

      // Полная остановка движения и анимации
      playerRef.current?.setVelocity(0, 0);
      playerRef.current?.body?.stop();
      playerRef.current?.anims.stop();

      // Отключаем гравитацию для игрока
      playerRef.current?.body?.gravity.set(0);

      // Останавливаем все платформы
      //@ts-ignore
      platformsRef.current?.children.each((platform) => {
        const p = platform as Phaser.Physics.Arcade.Sprite;
        p.body?.stop();
      });

      // Приостанавливаем обновление сцены
      player.scene.scene.pause();

      // Показ уведомления
      toastCenter.current?.show({
        severity: "success",
        summary: "Победа",
        detail: "Вы прошли уровень!",
        life: 30000,
      });

      // Отправка результата
      const username = sessionStorage.getItem("login");
      await fetch("http://localhost:3001/api/complete-level", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          level: 3,
        }),
      });
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

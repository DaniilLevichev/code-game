import { RootState } from "@/store/store";
import Phaser from "phaser";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

interface GameAPI {
  construction: {
    createPlatform: (x: number, y: number) => void;
    getPlatformsCount: () => number;
  };
  mechanics: {
    activateLever: (id: number) => void;
    isGateOpen: () => boolean;
  };
  movement: {
    enable: () => void;
  };
  events: {
    onEnemyDetect: (callback: () => void) => void;
  };
}

export default function Level5() {
  const { code, isStartLevel } = useSelector((state: RootState) => state.game);
  const [canMove, setCanMove] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const gameInstance = useRef<Phaser.Game | null>(null);
  const platformsCount = useRef(0);
  const leversActivated = useRef(new Set<number>());
  const enemiesRef = useRef<Phaser.Physics.Arcade.Group>(null);
  const platformsRef = useRef<Phaser.Physics.Arcade.StaticGroup>(null);
  const lavaGroup = useRef<Phaser.Physics.Arcade.StaticGroup>(null);

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
        gravity: { x: 0, y: 1000 },
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
  let gate: Phaser.Physics.Arcade.Sprite;
  let victoryText: Phaser.GameObjects.Text;

  useEffect(() => {
    if (gameInstance.current) {
      gameInstance.current.destroy(true);
    }

    resetGameState();
    gameInstance.current = new Phaser.Game(config);

    return () => {
      if (gameInstance.current) {
        gameInstance.current.destroy(true);
      }
    };
  }, [reloadKey]);

  useEffect(() => {
    if (isStartLevel) {
      setReloadKey((prev) => prev + 1);

      const api: GameAPI = {
        construction: {
          createPlatform: (x, y) => {
            if (platformsCount.current >= 20) return;
            platformsRef.current?.create(x, y, "box").refreshBody();
            platformsCount.current++;
          },
          getPlatformsCount: () => platformsCount.current,
        },
        mechanics: {
          activateLever: (id) => {
            leversActivated.current.add(id);
            if (leversActivated.current.size === 3) {
              gate.setTexture("gate_open").refreshBody();
            }
          },
          isGateOpen: () => leversActivated.current.size === 3,
        },
        movement: {
          enable: () => setCanMove(true),
        },
        events: {
          onEnemyDetect: (callback) => {
            const interval = setInterval(() => {
              if (isPlayerNearEnemy()) callback();
            }, 500);
            return () => clearInterval(interval);
          },
        },
      };

      try {
        if (!/(function|=>)\s*\(/.test(code)) {
          throw new Error("Используйте функции для организации кода!");
        }

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
    this.load.image("player_jump", "/assets/player/p1_jump.png");
    this.load.image("player_stand", "/assets/player/p1_stand.png");
    // this.load.image("lever", "/assets/objects/lever.png");
    // this.load.image("gate_closed", "/assets/objects/gate_closed.png");
    // this.load.image("gate_open", "/assets/objects/gate_open.png");
    // this.load.image("enemy", "/assets/enemies/slime.png");
    // this.load.image("box", "/assets/tiles/box.png");
    // this.load.image("lava", "/assets/effects/lava.png");

    this.load.image("lever", "/assets/tiles/box.png");
    this.load.image("gate_closed", "/assets/tiles/box.png");
    this.load.image("gate_open", "/assets/tiles/box.png");
    this.load.image("enemy", "/assets/enemies/slime.png");
    // this.load.image("box", "/assets/tiles/box.png");
    this.load.image("lava", "/assets/tiles/box.png");

    this.load.image("box", "/assets/tiles/box.png");
    this.load.image("background", "/assets/background/bg_castle.png");
    // this.load.image("flag", "/assets/hud/flagYellowHanging.png");
  }

  function create(this: Phaser.Scene) {
    // Фон
    this.add.image(400, 200, "background").setDisplaySize(800, 600);

    // Инициализация мира
    platformsRef.current = this.physics.add.staticGroup();
    enemiesRef.current = this.physics.add.group();
    lavaGroup.current = this.physics.add.staticGroup();

    // Лава
    lavaGroup.current.create(400, 580, "lava").setScale(8, 0.5).refreshBody();

    // Враги
    const enemy = enemiesRef.current.create(600, 500, "enemy");
    enemy.setVelocityX(-100).setCollideWorldBounds(true).setBounceX(1);

    // Ворота
    gate = this.physics.add.staticSprite(700, 200, "gate_closed");

    // Рычаги
    [150, 400, 650].forEach((x, i) => {
      const lever = this.physics.add.staticSprite(x, 550, "lever");
      lever.setInteractive().on("pointerdown", () => {
        lever.setTint(0x00ff00);
        //@ts-ignore
        this.mechanics.activateLever(i);
      });
    });

    // Персонаж
    player = this.physics.add
      .sprite(100, 500, "player_walk")
      .setCollideWorldBounds(true)
      .setScale(0.7)
      .setSize(40, 50)
      .setOffset(12, 14);

    // Коллайдеры
    this.physics.add.collider(player, platformsRef.current);
    this.physics.add.collider(player, lavaGroup.current, handleDeath);

    // Текст
    victoryText = this.add
      .text(400, 300, "ПОБЕДА!", {
        fontSize: "64px",
        color: "#00ff00",
      })
      .setOrigin(0.5)
      .setVisible(false);
  }

  function update(this: Phaser.Scene) {
    if (!canMove) return;

    // Движение
    const speed = 200;
    const cursors = this.input.keyboard?.createCursorKeys();
    player.setVelocityX(0);

    if (cursors?.left.isDown) {
      player.setVelocityX(-speed);
    } else if (cursors?.right.isDown) {
      player.setVelocityX(speed);
    }

    if (cursors?.up.isDown && player.body?.blocked.down) {
      player.setVelocityY(-500);
    }

    // Проверка победы
    if (
      gate.texture.key === "gate_open" &&
      Phaser.Math.Distance.Between(player.x, player.y, gate.x, gate.y) < 50
    ) {
      handleVictory();
    }
  }

  function handleVictory() {
    victoryText.setVisible(true);
    const restartButton = document.createElement("button");
    restartButton.textContent = "Следующий уровень";
    restartButton.style.position = "absolute";
    restartButton.style.left = "50%";
    restartButton.style.top = "70%";
    restartButton.style.transform = "translate(-50%, -50%)";
    restartButton.onclick = () => window.location.assign("/levels");
    document.getElementById("game-container")?.appendChild(restartButton);
  }

  function handleDeath() {
    setReloadKey((prev) => prev + 1);
  }

  function isPlayerNearEnemy() {
    return (
      Phaser.Math.Distance.Between(
        player.x,
        player.y,
        //@ts-ignore
        enemiesRef.current?.children.entries[0].x || 0,
        //@ts-ignore
        enemiesRef.current?.children.entries[0].y || 0
      ) < 150
    );
  }

  function resetGameState() {
    platformsCount.current = 0;
    leversActivated.current.clear();
    setCanMove(false);
  }

  return <div id="game-container" key={reloadKey} className="game-container" />;
}

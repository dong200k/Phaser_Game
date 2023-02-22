import Phaser from 'phaser';
import config from './config';
import GameScene from './scenes/GameScene';

// Create a new Phaser game with predefined config and scene
new Phaser.Game(
    Object.assign(config, {
        scene: [GameScene]
    })
);

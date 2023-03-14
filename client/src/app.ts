import Phaser from 'phaser';
import config from './config';
import GameScene from './scenes/GameScene';
import LobbyScene from './scenes/LobbyScene';
import MenuScene from './scenes/MenuScene';
import RoomScene from './scenes/RoomScene';

// Create a new Phaser game with predefined config and scene
new Phaser.Game(
    Object.assign(config, {
        scene: [MenuScene, GameScene, LobbyScene, RoomScene]
    })
);

import Phaser from 'phaser';
import * as Colyseus from 'colyseus.js';
import ClientManager from '../colyseus/ClientManager';

export default class GameScene extends Phaser.Scene {

    private gameRoom: Colyseus.Room | null = null;

    constructor() {
        super('GameScene');
    }

    create() {
        const color = 0x000000;
        const rect = this.add.rectangle(250, 150, 50, 50, color);

        this.tweens.add({
            targets: rect,
            y: 500,
            duration: 3000,
            ease: 'Sine.inOut',
            yoyo: true,
            repeat: -1,
        });

        ClientManager.getClient().joinGameRoom().then()
    }
}

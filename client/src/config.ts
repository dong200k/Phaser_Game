import Phaser from 'phaser';

export default {
    type: Phaser.AUTO,
    parent: 'game',
    backgroundColor: `#333333`,
    scale: {
        width: 1280,
        height: 800,
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
};


export type PhaserAudio = Phaser.Sound.NoAudioSound | Phaser.Sound.HTML5AudioSound | Phaser.Sound.WebAudioSound;

export interface ServerEvent {
    name: string;
    args?: any;
}
import GameObject from "../gameobjs/GameObject";

interface StatusIconData { 
    statusIcon: Phaser.GameObjects.Sprite;
    timeout: number;
    followTarget: GameObject;
}

export default class StatusIconManager {

    private scene: Phaser.Scene;
    private statusIconGroup: Phaser.GameObjects.Group;

    private statusIcons: StatusIconData[] = [];
    private counter: number = 0;

    constructor(scene: Phaser.Scene) {
        this.scene = scene;
        this.statusIconGroup = this.scene.add.group({maxSize: 1000, max: 1000});
    }

    public update(deltaT: number) {
        for(let i = this.statusIcons.length - 1; i >= 0; i--) {
            let statusIconData = this.statusIcons[i];
            statusIconData.timeout -= deltaT;
            
            let followTarget = statusIconData.followTarget;
            statusIconData.statusIcon.setPosition(followTarget.x, followTarget.y - followTarget.height / 2);

            if(statusIconData.timeout <= 0 || !followTarget.active) {
                statusIconData.statusIcon.setActive(false);
                statusIconData.statusIcon.setVisible(false);
                // this.statusIconGroup.
                this.statusIcons.splice(i, 1);
            }
        }

        this.counter ++;
        if(this.counter % 200 === 0) {
            console.log(this.statusIcons);
        }
    }

    public addStatusIcon(key: string, time: number, followTarget: GameObject) {
        let statusIcon = this.statusIconGroup.get(followTarget.x, followTarget.y, key);
        statusIcon.setVisible(true);
        statusIcon.setActive(true);
        statusIcon.setScale(0.75, 0.5);
        this.statusIcons.push({
            statusIcon: statusIcon,
            timeout: time,
            followTarget: followTarget,
        })
    }

}

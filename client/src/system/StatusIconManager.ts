import GameObject from "../gameobjs/GameObject";

interface StatusIconData { 
    statusIcon: Phaser.GameObjects.Sprite;
    timeout: number;
    followTarget: GameObject;
    iconId: number;
}

export default class StatusIconManager {

    private scene: Phaser.Scene;
    private statusIconGroup: Phaser.GameObjects.Group;

    private statusIcons: StatusIconData[] = [];
    // private followTargetSet: Set<GameObject> = new Set();
    // private counter: number = 0;

    constructor(scene: Phaser.Scene) {
        this.scene = scene;
        this.statusIconGroup = this.scene.add.group({maxSize: 1000, max: 1000});
    }

    public update(deltaT: number) {
        for(let i = this.statusIcons.length - 1; i >= 0; i--) {
            let statusIconData = this.statusIcons[i];
            
            let followTarget = statusIconData.followTarget;
            statusIconData.statusIcon.setPosition(followTarget.x, followTarget.y - followTarget.height / 2);

            if(!followTarget.active) {
                this.spliceStatusIcon(i);
            } else {
                // A -1 timeout means that there is no timeout and so we dont automatically remove the status icon.
                if(statusIconData.timeout !== -1) {
                    statusIconData.timeout -= deltaT;
                    if(statusIconData.timeout <= 0) {
                        this.spliceStatusIcon(i);
                    }
                }
            }
        }
    }

    /**
     * Adds and displays a status icon that follows a followTarget.
     * @param key The texture key.
     * @param time The timer for icon removal.
     * @param followTarget The followTarget.
     * @param iconId The iconId. Can be used to manually remove icon.
     */
    public addStatusIcon(key: string, time: number, followTarget: GameObject, iconId: number) {
        let statusIcon = this.statusIconGroup.get(followTarget.x, followTarget.y, key);
        statusIcon.setVisible(true);
        statusIcon.setActive(true);
        statusIcon.setScale(0.75, 0.5);
        this.statusIcons.push({
            statusIcon: statusIcon,
            timeout: time,
            followTarget: followTarget,
            iconId,
        });
    }

    /**
     * Manually removes the status icon.
     * @param iconId The iconId.
     */
    public removeStatusIcon(iconId: number) {
        for(let i = this.statusIcons.length - 1; i >= 0; i--) {
            let statusIconData = this.statusIcons[i];
            if(statusIconData.iconId === iconId) {
                this.spliceStatusIcon(i);
            }
        }
    }

    /** Performs status icon removal operations and splices the icon data from 
     * the statusIcons list.
     * @param idx The idx of the statusIcon to remove.
     */
    private spliceStatusIcon(idx: number) {
        let statusIconData = this.statusIcons[idx];
        // Removes and returns the status icon to pool.
        statusIconData.statusIcon.setActive(false);
        statusIconData.statusIcon.setVisible(false);
        this.statusIcons.splice(idx, 1);
    }

    private removeStackedStatusIcons() {

    }

}

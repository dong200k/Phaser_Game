import Phaser from "phaser";

export default abstract class Entity extends Phaser.Physics.Matter.Sprite
{

    constructor(scene: Phaser.Scene) {
        super(scene.matter.world, 0, 0, "");
    }

    public initializeListeners(entityState:any) {
        entityState.onChange = (changes:any) => {
            changes.forEach(({field, value}: any) => {
                switch(field) {
                    case "x": this.x = value; break;
                    case "y": this.y = value; break;
                    // case "velocity": {
                    //     this.setVelocity(value.x, value.y);
                    // }; break;
                }
            })
        }
        // entityState.velocity.onChange = (changes: any) => {
        //     changes.forEach(({field, value}: any) => {
        //         switch(field) {
        //             case "x": this.setVelocityX(value); break;
        //             case "y": this.setVelocityY(value); break;
        //         }
        //     })
        // }
    }
}
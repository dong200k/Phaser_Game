import Entity from "./Entity";

export default class Monster extends Entity
{
    private monsterState: any;
    /** Is the walking animation playing or not. */
    walking: boolean = false;

    // static count: number = 0;

    constructor(scene:Phaser.Scene, monsterState:any) {
        super(scene, monsterState.x, monsterState.y, monsterState.imageKey, monsterState);
        this.monsterState = monsterState;
        // Generate animations for this monster.
        scene.anims.createFromAseprite(monsterState.imageKey, undefined, this);

        // Monster.count++;
        // console.log(`Monster Constructed: ${Monster.count}`);

        // this.setScale(monsterState.width/this.width, monsterState.height/this.height)

        // let obj = monsterState as any
        // console.log("client obj info: ", obj.type, obj.name, obj.monsterName, obj.sprite, this.width, this.height)
        // console.log("gameObjectState width height:", monsterState.width, monsterState.height)
    }

    // /**Add listeners to connect to the server's player*/
    // public initializeListeners(monsterState:any) {
    //     monsterState.onChange = (changes:any) => {
    //         changes.forEach(({field, value}: any) => {
    //             switch(field) {
    //                 case "x": this.x = value; break;
    //                 case "y": this.y = value; break;
    //             }
    //         })
    //     }
    // }

}
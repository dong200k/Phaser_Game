import Entity from "./Entity";

export default class Monster extends Entity
{
    private monsterState: any;
    /** Is the walking animation playing or not. */
    walking: boolean = false;

    /** Is the monster active or not. */

    constructor(scene:Phaser.Scene, monsterState:any) {
        super(scene, monsterState.x, monsterState.y, monsterState.monsterName, monsterState);
        this.monsterState = monsterState;
        // Generate animations for this monster.
        scene.anims.createFromAseprite(monsterState.monsterName, undefined, this);
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
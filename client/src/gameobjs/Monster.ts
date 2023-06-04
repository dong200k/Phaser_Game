import Entity from "./Entity";

export default class Monster extends Entity
{
    private monsterState: any;

    constructor(scene:Phaser.Scene, monsterState:any) {
        super(scene, monsterState.x, monsterState.y, monsterState.monsterName);
        this.monsterState = monsterState;
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
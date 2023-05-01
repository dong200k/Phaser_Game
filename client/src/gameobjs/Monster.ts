import Entity from "./Entity";

export default class Monster extends Entity
{
    private monsterState: any;

    constructor(scene:Phaser.Scene, monsterState:any) {
        super(scene);
        this.monsterState = monsterState;
        this.initializeListeners(this.monsterState);
        console.log(`Monster Name: ${monsterState.monsterName}`);
        this.setTexture(monsterState.monsterName);
    }

    /**Add listeners to connect to the server's player*/
    public initializeListeners(monsterState:any) {
        monsterState.onChange = (changes:any) => {
            changes.forEach(({field, value}: any) => {
                switch(field) {
                    case "x": this.x = value; break;
                    case "y": this.y = value; break;
                }
            })
        }
    }

}
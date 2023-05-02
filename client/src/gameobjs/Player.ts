import Entity from "./Entity";
import PlayerState from "../../../server/src/rooms/game_room/schemas/gameobjs/Player"
export default class Player extends Entity
{
    private playerState: any;

    constructor(scene:Phaser.Scene,playerState:PlayerState) {
        super(scene, 0, 0, "demo_hero")
        this.playerState = playerState;
    }

    /**Add listeners to connect to the server's player*/
    public initializeListeners(playerState: PlayerState) {
        console.log(playerState.weapon)
        // console.log(playerState.weaponUpgradeTree.root)
        // console.log(playerState.weaponUpgradeTree.root?.children[0].data.stat)
        playerState.onChange = (changes:any) => {
            changes.forEach(({field, value}: any) => {
                switch(field) {
                    case "x": this.x = value; break;
                    case "y": this.y = value; break;
                }
            })
        }
    }

}
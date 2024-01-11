import GameManager from "../../../system/GameManager";
import { AABB, DialogData } from "../../../system/interfaces";
import Entity from "../Entity";
import Player from "../Player";
import GameEvent from "./GameEvent";



export default class DialogEvent extends GameEvent {
    
    private dialogData: DialogData;
    private dialogName: string;

    /**
     * Creates a new dialog event that tiggers a dialog when the player steps over it.
     * @param gameManager The GameManager.
     * @param dialogName The name of the dialog, should be unique. Used to flag the dialog as seen.
     * @param dialogData The DialogData.
     * @param bounds The bounds of the dialog event.
     */
    constructor(gameManager: GameManager, dialogName: string, dialogData: DialogData, bounds: AABB) {
        super(gameManager, bounds);
        this.dialogData = dialogData;
        this.dialogName = dialogName;
    }

    public handleEvent(entity: Entity): void {
        if(entity instanceof Player) {
            let seenSet = entity.getDialogSeen();
            // Only show the player the dialog if they haven't yet already seen it.
            if(!seenSet.has(this.dialogName)) {
                this.gameManager.getPlayerManager().sendClientDialog(entity.id, this.dialogData);
                seenSet.add(this.dialogName);
            }
        }
    }

}


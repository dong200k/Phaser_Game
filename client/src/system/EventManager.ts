import Phaser from "phaser";
import { PlayerInfoData } from "../UI/gameuis/PlayerInfo";

namespace EventManager {

    /** eventEmitter is used to emit and listen to global events.
     * Use the EventManager's namespaces to use built in events.
     * 
     * Ex:
     * ```Typescript
     * let callback: EventManager.HUDEvents.updatePlayerInfoFunction;
     * callback = (...) => {...}; 
     * EventManager.eventEmitter.emit(EventManager.HUDEvents.updatePlayerInfo, callback);
     * ```
     * In the example above, we declared a callback and set it with the correct function type (Note: this is useful for autocomplete).
     * Then we created the callback by assigning it an anonymous function. 
     * Finally we call the emit function on the eventEmitter and pass in the event name and callback.
     * */
    export const eventEmitter = new Phaser.Events.EventEmitter();

    export namespace HUDEvents {
        /** Event to update the HUD's player info display. (hp, mp, xp, special, hotslot and level) 
         * 
         * Emit this event by running ```EventManager.eventEmitter.emit(EventManager.HUDEvents.UPDATE_PLAYER_INFO, args)```
         * 
         * @param args
         * ```
         * {
                slot1ItemKey: string;
                slot2ItemKey: string;
                slot3ItemKey: string;
                hpValue: number;
                maxHpValue: number;
                mpValue: number;
                maxMpValue: number;
                xpValue: number;
                maxXpValue: number;
                level: number;
                specialCooldownCounter: number;
                specialCooldownPercent: number;
                specialImageKey: string;
            }
         * ```
        */
        export const UPDATE_PLAYER_INFO = "HUDSceneUpdatePlayerInfo";

        /**
         * Emitting this event will update the artifact display.
         * 
         * Emit this event by running ```EventManager.eventEmitter.emit(EventManager.HUDEvents.UPDATE_ARTIFACT_DISPLAY, args)```
         * 
         * @param args
         * ```
         * {
         *     items: [{
         *         imageKey:string,
         *         level:number
         *     }, ...]
         * }
         * ```
         */
        export const UPDATE_ARTIFACT_DISPLAY = "HUDSceneUpdateArtifactDisplay";

        /**
         * Emitting this event will create or update a peer info inside the PeerInfoPopup.
         * 
         * Emit this event by running ```EventManager.eventEmitter.emit(EventManager.HUDEvents.CREATE_OR_UPDATE_PEER_INFO, key, data)```
         * 
         * @param key The key of the PeerInfo. If the PeerInfo with the key doesn't exist 
         * it will be create. Otherwise it will be updated.
         * @param data 
         * ```
         * {
                slot1ItemKey: string;
                slot2ItemKey: string;
                slot3ItemKey: string;
                hpValue: number;
                maxHpValue: number;
                mpValue: number;
                maxMpValue: number;
                xpValue: number;
                maxXpValue: number;
                level: number;
                specialCooldownPercent: number;
                specialImageKey: string;
                name: string;
                roleImageKey: string;
            }
         * ```
         */
        export const CREATE_OR_UPDATE_PEER_INFO = "HUDSceneCreateOrUpdatePeerInfo";

        /**
         * Emitting this event will remove a PeerInfo from the PeerInfoPopup.
         * 
         * Emit this event by running ```EventManager.eventEmitter.emit(EventManager.HUDEvents.DELETE_PEER_INFO, key)```
         * 
         * @param key The key of the PeerInfo to delete.
         */
        export const DELETE_PEER_INFO = "HUDSceneDeletePeerInfo";
    }

    export namespace GameEvents {
        /** Event to notify the GameScene to leave the game. Should only be emitted when GameScene is running.*/
        export const LEAVE_GAME = "GameSceneLeaveGame";
    }

}

export default EventManager;
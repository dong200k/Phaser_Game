import Player from "../../schemas/gameobjs/Player"
import GameManager from "../GameManager"
import { IWeaponLogic } from "./WeaponLogic"
import bow from "./bow"

export default class WeaponLogicManager{
    static singleton = new WeaponLogicManager()
    weaponLogics: Map<string, IWeaponLogic> = new Map()

    constructor(){
        this.loadWeapons()
    }

    /**
     * Loads all weapons logic, attack, etc so that they can be used in Game
     */
    loadWeapons(){
        this.weaponLogics.set(bow.weaponId, bow)
    }

    /**
     * Use the player's weapons attack
     * @param playerState Player who wants to use their weapon's attack
     * @param gameManager GameManager for the game the player is currently in
     * @returns 
     */
    useAttack(playerState: Player, gameManager: GameManager, data?: any){
        let weaponId = playerState.weaponUpgradeTree.currentWeaponId
        if(!weaponId) return console.log(`${Player.name} has no weapon!`)
        
        let weapon = this.weaponLogics.get(weaponId)
        if(!weapon) return console.log(`${weaponId} is not a key for a valid weapon!`)

        weapon.useAttack(playerState, gameManager, data)
    }

    static getManager(){
        return this.singleton
    }
}
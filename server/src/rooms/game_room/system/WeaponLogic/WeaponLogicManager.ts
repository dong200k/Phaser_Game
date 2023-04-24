import Player from "../../schemas/gameobjs/Player"
import GameManager from "../GameManager"
import { IWeaponLogic } from "./WeaponLogic"
import bow from "./bow"

export default class WeaponLogicManager{
    static singleton = new WeaponLogicManager()
    weaponLogics: Map<string, IWeaponLogic> = new Map()

    constructor(){
        this.loadWeaponLogics()
    }

    /**
     * Loads all weapons logic, attack, etc so that they can be used in Game
     */
    loadWeaponLogics(){
        this.weaponLogics.set(bow.weaponId, bow)
    }

    /**
     * Use the player's weapons attack
     * @param playerState Player who wants to use their weapon's attack
     * @param gameManager GameManager for the game the player is currently in
     * @returns 
     */
    useAttack(playerState: Player, gameManager: GameManager, data?: any){
        let weapon = playerState.weapon
        let weaponId = weapon.weaponId

        if(weaponId){
            let weaponLogic = this.weaponLogics.get(weaponId)

            if(weaponLogic){
                weaponLogic.useAttack(playerState, gameManager, data)
            }else{
                throw new Error(`${weaponId} is not a key for a valid weapon!`)
            }
        }
    }

    static getManager(){
        return this.singleton
    }
}
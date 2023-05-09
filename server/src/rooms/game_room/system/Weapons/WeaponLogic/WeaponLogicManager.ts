import Player from "../../../schemas/gameobjs/Player"
import GameManager from "../../GameManager"
import { IWeaponLogic } from "./WeaponLogic"
import bow from "./bow"

export default class WeaponLogicManager{
    static singleton = new WeaponLogicManager()
    private weaponLogics: Map<string, IWeaponLogic> = new Map()
    gameManager!: GameManager

    constructor(){
        this.loadWeaponLogics()
    }
    
    setGameManager(gameManager: GameManager){
        this.gameManager = gameManager
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
     * @returns 
     */
    useAttack(playerState: Player, data?: any){
        if(! this.gameManager) return
        
        let weaponId = playerState.weaponUpgradeTree.weaponId
        if(weaponId){
            let weaponLogic = this.weaponLogics.get(weaponId)

            if(weaponLogic){
                weaponLogic.useAttack(playerState, this.gameManager, data)
            }else{
                throw new Error(`${weaponId} is not a key for a valid weapon!`)
            }
        }
    }

    getWeaponLogic(weaponId: string){
        return this.weaponLogics.get(weaponId)
    }

    static getManager(){
        return this.singleton
    }
}
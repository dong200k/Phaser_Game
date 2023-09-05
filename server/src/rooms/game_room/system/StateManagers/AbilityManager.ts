import WeaponData from '../../schemas/Trees/Node/Data/WeaponData';
import Node from '../../schemas/Trees/Node/Node';
import Ability from '../../schemas/gameobjs/Ability';
import Player from '../../schemas/gameobjs/Player';
import GameManager from '../GameManager';
import { IAbility } from '../interfaces';
import TreeManager from './TreeManager';

export default class AbilityManager{
    private gameManager: GameManager
    
    constructor(gameManager: GameManager){
        this.gameManager = gameManager
    }

    /**
     * Update active ability for each players.
     * @param deltaT 
     */
    public update(deltaT: number){
        this.gameManager.gameObjects.forEach((obj, key) => {
            if(obj instanceof Player){
                obj.currentAbility?.update(deltaT)
            }
        })
    }

    /**
     * Adds ability to the player's list of abilities and sets it as the active ability.
     * @param playerState player who is equiping the WeaponUpgradeTree
     * @param IAbility config of ability to equip
     */
    public equipAbility(playerState: Player, ability: Ability){
        playerState.abilities.push(ability)
        playerState.currentAbility = ability
    }

    /**
     * Swaps the ability the player has inside playerState.abilities indexed by slot to the current/active ability
     * @param playerState 
     * @param slot number indicating which ability to use
     */
    public changeActiveAbility(playerState: Player, slot: number){
        if(slot < playerState.abilities.length){
            playerState.currentAbility = playerState.abilities[slot]
        }
    }

    /**
     * Removes ability from player's list of abilities. If the ability is the active ability, sets the active ability to the first ability
     * in the player's ability list if there are any.
     * @param playerState 
     * @param slot number indicating which ability to remove
     */
    public removeAbility(playerState: Player, slot: number){
        if(slot < playerState.abilities.length){
            let removedAbility = playerState.currentAbility
            playerState.abilities.deleteAt(slot)

            // if current ability is one to be removed then set current ability to next available ability
            if(removedAbility === playerState.currentAbility){
                if(playerState.abilities.length > 0){
                    playerState.currentAbility = playerState.abilities[0]
                }
            }
        }
    }

    /**
     * Creates a ability schema from my-app tool ability.
     * @param IAbility json/config of ability from my-app tool
     * @returns 
     */
    public createAbility(IAbility: IAbility){
        return new Ability(IAbility, this.gameManager)
    }
}
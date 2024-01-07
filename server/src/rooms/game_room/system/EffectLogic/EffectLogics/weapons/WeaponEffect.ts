import { Body } from "matter-js"
import Player from "../../../../schemas/gameobjs/Player"
import GameManager from "../../../GameManager"
import { SpecialEffectLogic } from "../special/SpecialEffectLogic"
import { GameEvents, IProjectileConfig } from "../../../interfaces"
import WeaponUpgradeTree from "../../../../schemas/Trees/WeaponUpgradeTree"
import Projectile from "../../../../schemas/projectiles/Projectile"
import { CategoryType } from "../../../Collisions/Category"
import MathUtil from "../../../../../../util/MathUtil"
import { spawnProjectilesRotated } from "../helper"
import Entity from "../../../../schemas/gameobjs/Entity"

export default class WeaponEffect extends SpecialEffectLogic{
    effectLogicId = "WeaponEffect"
    protected summonedWeapon = false
    protected weapon?: Projectile
    /** TODO get weapon number from players weapons equiped */
    protected weaponNumber = 3
    protected maxWeaponNumber = 4
    protected attacksSoFar = 0 
    /** Spawn distance of the weapon from player */
    protected radius = 50
    /** Sprite key of the summoned weapon following the player */
    protected weaponSprite = ""

    // ----- A few variables that affects weapon attacks ------
    protected activeRange?: number
    protected activeTime?: number
    protected attackSound: string = "lightningrod"
    protected angleBetweenAttacks = 15
    protected projectileSpeed = 50
    protected projectileSprite = ""
    protected attackRequired = 5
    /** Time in miliseconds between projectiles if multiple projectiles are fired */
    protected timeBetweenProjectiles = 0
    /** Time in miliseconds between attacks, used usually if the weapon requires less than 1 attack so the attacks dont stack*/
    protected timeBetweenAttacks = 0
    protected attackPoolType = ""
    /** Spawn distance of the projectile from the weapon towards the target */
    protected spawnOffset = 0

    public useEffect(playerState: Player, gameManager: GameManager, tree: WeaponUpgradeTree, playerBody: Body): void {
        // console.log("use effect weapon effect")
        if(!this.summonedWeapon) {
            this.summonedWeapon = true
            this.weaponNumber = playerState.weaponCount
            playerState.weaponCount++
            this.summonWeapon(playerState, gameManager)
            this.applyStatChange(playerState, gameManager)
        }
        this.attacksSoFar++
        // console.log(`attack count: ${this.attacksSoFar}, for ${this.effectLogicId}`)

        let i = 0
        while(this.attackRequired <= this.attacksSoFar){
            this.attacksSoFar -= this.attackRequired
            // console.log(`attack: ${this.effectLogicId}`)
            setTimeout(()=>{
                this.useSpecial(playerState, gameManager)
            }, i * this.timeBetweenAttacks)
            i++
        }
    }
    protected useSpecial(playerState: Player, gameManager: GameManager): void {
        this.playWeaponAttackAnimation()        
        this.attack(playerState, gameManager)
    }

    protected applyStatChange(playerState: Player, gameManager: GameManager){

    }

    protected summonWeapon(playerState: Player, gameManager: GameManager){
        let width = this.getFinalWidth()
        let height = this.getFinalHeight()
        let {x, y} = playerState.getBody().position

        let angle = 360 * this.weaponNumber/this.maxWeaponNumber 
        let {x: offsetX, y: offsetY} = MathUtil.getRotatedSpeed(0, 0, this.radius, angle)
        
        let projectileConfig: IProjectileConfig = {
            sprite: this.weaponSprite,
            stat: playerState.stat,
            spawnX: x + offsetX,
            spawnY: y + offsetY,
            width,
            height,
            initialVelocity: {x: 0, y: 0},
            collisionCategory: "NONE",
            poolType: this.weaponSprite,
            attackMultiplier: this.getMult(),
            magicMultiplier: 0,
            dontDespawnOnObstacleCollision: true,
            // repeatAnimation: true,
            // spawnSound: "flame_dash",
            classType: "FollowingMeleeProjectile",
            originEntityId: playerState.getId(),
            // projectileSpeed: 50,
            dontRotate: true,
            repeatAnimation: true,
            data: {
                owner: playerState,
                offsetX,
                offsetY
            }
        }
        
        this.weapon = gameManager.getProjectileManager().spawnProjectile(projectileConfig, projectileConfig.classType).projectile
    }

    protected playWeaponAttackAnimation(){

    }

    /** Overwrite this with the weapons attack logic */
    protected attack(playerState: Player, gameManager: GameManager){
        // console.log(`attempting attack: ${this.effectLogicId}`)
        let weaponBody = this.weapon?.getBody()
        if(!weaponBody) return console.log(`attack ${this.effectLogicId}, no weapon body`)
        // console.log(`attempting attack stage 2: ${this.effectLogicId}`)

        const spawnProjectile = (velocity: {x: number, y: number}) => {
            if(!weaponBody) return
            let unitDir = MathUtil.getNormalizedSpeed(velocity.x, velocity.y, 1)
            let offsetX = this.spawnOffset * unitDir.x
            let offsetY = this.spawnOffset * unitDir.y
            console.log(`spawn projectile spawn offset: ${offsetX}, ${offsetY}`)
            let projectileConfig: IProjectileConfig = {
                sprite: this.projectileSprite,
                stat: playerState.stat,
                spawnX: weaponBody.position.x + offsetX,
                spawnY: weaponBody.position.y + offsetY,
                width: this.getFinalWidth(),
                height: this.getFinalHeight(),
                initialVelocity: velocity,
                collisionCategory: "PLAYER_PROJECTILE",
                poolType: this.attackPoolType === ""? this.projectileSprite : this.attackPoolType,
                attackMultiplier: this.getAttackMult(),
                magicMultiplier: this.getMagicMult(),
                dontDespawnOnObstacleCollision: true,
                range: this.activeRange,
                activeTime: this.activeTime,
                repeatAnimation: false,
                spawnSound: this.attackSound,
                piercing: this.getPiercing(),
                classType: "Projectile",
                originEntityId: playerState.getId(),
                dontRotate: true,
            }

            gameManager.getEventEmitter().emit(GameEvents.SPAWN_PROJECTILE, {
                ...projectileConfig,
            });
        }
        
        let amount = this.getAmount(playerState.stat)
        let target: Entity | undefined = this.getTarget(playerState, gameManager)
        if(target){
            // console.log(`attempting attack stage 3: ${this.effectLogicId}`)
            let velocity = {x: target.x - weaponBody.position.x, y: target.y - weaponBody.position.y}

            // let velocity = {x: target.getBody().position.x - weaponBody.position.x, y: target.getBody().position.y - weaponBody.position.y}
            spawnProjectilesRotated(spawnProjectile, this.angleBetweenAttacks, this.getAmount(playerState.stat), velocity.x, velocity.y, this.projectileSpeed, this.timeBetweenProjectiles)
        }
    }

    protected getAttackMult(){
        return this.getMult()
    }

    protected getMagicMult(){
        return 0
    }

    protected getTarget(player: Player, gameManager: GameManager){
        let target = gameManager.getDungeonManager().getClosestActiveMonster({x: this.weapon?.x?? player.x, y: this.weapon?.y ?? player.y})
        // if(!target) return player
        return target
    }
}
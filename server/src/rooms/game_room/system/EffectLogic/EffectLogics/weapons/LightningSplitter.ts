import MathUtil from "../../../../../../util/MathUtil";
import EffectFactory from "../../../../schemas/effects/EffectFactory";
import Player from "../../../../schemas/gameobjs/Player";
import GameManager from "../../../GameManager";
import EffectManager from "../../../StateManagers/EffectManager";
import { GameEvents, IProjectileConfig } from "../../../interfaces";
import { spawnProjectilesRotated } from "../helper";
import WeaponEffect from "./WeaponEffect";

export default class LightningSplitter extends WeaponEffect{
    effectLogicId: string = "LightningSplitter"
    protected weaponSprite: string = "lightning_splitter"
    protected activeTime = 1000
    protected projectileSpeed = 0
    protected projectileSprite: string = "Lightning"
    protected attackRequired: number = 10
    protected piercing: number = -1
    protected attackMultiplier: number = 2
    protected amount: number = 10
    protected spawnOffset: number = 25
    protected attackPoolType: string = "Lightning_Splitter_Projectile"
    protected timeBetweenProjectiles: number = 100

    protected applyStatChange(playerState: Player, gameManager: GameManager): void {
        let statEffect = EffectFactory.createStatEffect({attack: 5, speed: -playerState.stat.speed * 0.25})
        EffectManager.addEffectsTo(playerState, statEffect)
    }

    /** Overwrite this with the weapons attack logic */
    protected attack(playerState: Player, gameManager: GameManager){
        // console.log(`attempting attack stage 1: ${this.effectLogicId}`)

        let weaponBody = this.weapon?.getBody()
        if(!weaponBody) return console.log(`attack ${this.effectLogicId}, no weapon body`)

        // console.log(`attempting attack stage 2: ${this.effectLogicId}`)


        let target = this.getTarget(playerState, gameManager)
        if(target){
            let velocity = {x: target.x - weaponBody.position.x, y: target.y - weaponBody.position.y}
            let amount = this.getAmount(playerState.stat)
            for(let i=0;i<amount;i++){
                // console.log(`time: ${i * this.timeBetweenProjectiles}`)
                setTimeout(()=>{
                    if(!weaponBody) return console.log(`attack ${this.effectLogicId}, no weapon body 2`)
                    let unitDir = MathUtil.getNormalizedSpeed(velocity.x, velocity.y, 1)
                    let offsetX = this.spawnOffset * (i + 1) * unitDir.x
                    let offsetY = this.spawnOffset * (i + 1) * unitDir.y
                    // console.log(`attempting attack stage 3: ${this.effectLogicId}, offset: ${offsetX} ${offsetY}, spawnOffset: ${this.spawnOffset}`)
                    let projectileConfig: IProjectileConfig = {
                        sprite: this.projectileSprite,
                        stat: playerState.stat,
                        spawnX: weaponBody.position.x + offsetX,
                        spawnY: weaponBody.position.y + offsetY,
                        width: this.getFinalWidth(),
                        height: this.getFinalHeight(),
                        initialVelocity: {x: 0, y: 0},
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
                        dontRotate: false,
                    }

                    gameManager.getEventEmitter().emit(GameEvents.SPAWN_PROJECTILE, {
                        ...projectileConfig,
                    });
                }, i * this.timeBetweenProjectiles)
            }
        }
    }
}
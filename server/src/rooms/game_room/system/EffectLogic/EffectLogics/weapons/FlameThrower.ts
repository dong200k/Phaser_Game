import MathUtil from "../../../../../../util/MathUtil";
import EffectFactory from "../../../../schemas/effects/EffectFactory";
import Player from "../../../../schemas/gameobjs/Player";
import GameManager from "../../../GameManager";
import EffectManager from "../../../StateManagers/EffectManager";
import { GameEvents, IProjectileConfig } from "../../../interfaces";
import WeaponEffect from "./WeaponEffect";

export default class FlameThrower extends WeaponEffect{
    effectLogicId: string = "FlameThrowerGun"
    protected weaponSprite: string = "flamethrower_gun"
    protected attackRequired: number = 10
    protected piercing: number = 1
    protected attackMultiplier: number = 1.5
    protected amount: number = 1
    protected amountCap: number = 1

    protected duration: number = 2
    private changeDirectionTime = 400
    private isFiring = false
    private timeBetweenSpawnSoFar = 0
    private timeSoFar = 0
    private firstUse = true
    private playerState!: Player
    private gameManager!: GameManager

    protected applyStatChange(playerState: Player, gameManager: GameManager): void {
        let statEffect = EffectFactory.createStatEffect({armor: -0.05 * playerState.stat.armor})
        EffectManager.addEffectsTo(playerState, statEffect)
    }

    protected attack(playerState: Player, gameManager: GameManager): void {
        if(this.firstUse) {
            this.playerState = playerState
            this.gameManager = gameManager
            this.firstUse = false
        }
        this.beginFire()
    }

    private beginFire(){
        this.isFiring = true
        this.timeBetweenSpawnSoFar = this.changeDirectionTime
    }

    private stopFire(){
        this.isFiring = false
    }
    
    public update(deltaT: number): void {
        super.update(deltaT)
        if(this.isFiring){
            this.timeBetweenSpawnSoFar += deltaT
            this.timeSoFar += deltaT
            
            if(this.timeSoFar > this.getDuration() * 1000) {
                this.stopFire()
                this.timeSoFar = 0
            }
    
            if(this.timeBetweenSpawnSoFar >= this.changeDirectionTime){
                this.timeBetweenSpawnSoFar = 0
                this.spawnProjectile(this.playerState, this.gameManager)
            }
        }
    }

    private spawnProjectile(playerState: Player, gameManager: GameManager){
        let width = this.getFinalWidth()
        let height = this.getFinalHeight()
        let {x, y} = playerState.getBody().position

        // let offsetX = (width/2 + playerState.width/2)
        // let playerVelocityX = playerState.getBody().velocity.x 
        // if(playerVelocityX < 0) offsetX *= -1
        // let velocityX = playerVelocityX > 0 ? 1 : -1

        let playerPos = playerState.getBody().position
        let target = gameManager.getDungeonManager().getClosestActiveMonster(playerPos)
        let targetPos = target? target.getBody().position : {x: playerPos.x, y: playerPos.y}
        let velocity = MathUtil.getNormalizedSpeed(targetPos.x - playerPos.x, targetPos.y - playerPos.y, 1)

        let projectileConfig: IProjectileConfig = {
            sprite: "flame_thrower",
            stat: playerState.stat,
            spawnX: x,
            spawnY: y,
            width,
            height,
            initialVelocity: velocity,
            collisionCategory: "PLAYER_PROJECTILE",
            poolType: "flame_thrower_projectile",
            attackMultiplier: this.getMult(),
            magicMultiplier: 0,
            dontDespawnOnObstacleCollision: true,
            piercing: -1,
            activeTime: this.changeDirectionTime,
            // spawnSound: "flame_dash",
            classType: "FollowingMeleeProjectile",
            originEntityId: playerState.getId(),
            repeatAnimation: true,
            animationKey: "play2",
            data: {
                owner: playerState,
                offsetX: velocity.x * 50,
                offsetY: velocity.y * 50
            }
        }
        
        gameManager.getEventEmitter().emit(GameEvents.SPAWN_PROJECTILE, {
            ...projectileConfig,
        });
    }
}
import { Body } from "matter-js"
import { SpecialEffectLogic } from "../SpecialEffectLogic"
import Player from "../../../../../schemas/gameobjs/Player"
import GameManager from "../../../../GameManager"
import { GameEvents, IProjectileConfig } from "../../../../interfaces"
import { start } from "repl"
import Monster from "../../../../../schemas/gameobjs/monsters/Monster"
import MathUtil from "../../../../../../../util/MathUtil"

export default class UltimateFlameThrower extends SpecialEffectLogic{
    effectLogicId = "UltimateFlameThrower"
    // protected area: number = 3
    protected duration: number = 2
    private changeDirectionTime = 400
    private isFiring = false
    private timeBetweenSpawnSoFar = 0
    private timeSoFar = 0
    private firstUse = true
    private playerState!: Player
    private gameManager!: GameManager

    protected useSpecial(playerState: Player, gameManager: GameManager): void {
        console.log("use ultimate flame thrower")
        if(this.firstUse){
            this.firstUse = false
            this.playerState = playerState
            this.gameManager = gameManager
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
            poolType: "flame_thrower",
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
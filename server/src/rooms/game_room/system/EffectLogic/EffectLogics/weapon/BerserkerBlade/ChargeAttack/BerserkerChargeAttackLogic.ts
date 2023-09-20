import MathUtil from "../../../../../../../../util/MathUtil";
import WeaponUpgradeTree from "../../../../../../schemas/Trees/WeaponUpgradeTree";
import Player from "../../../../../../schemas/gameobjs/Player";
import { getFinalChargeAttackSpeed } from "../../../../../Formulas/formulas";
import GameManager from "../../../../../GameManager";
import { GameEvents, IProjectileConfig } from "../../../../../interfaces";
import ChargeAttackLogic from "../../../common/ChargeAttackLogic";

export default class BerserkerChargeAttackLogic extends ChargeAttackLogic{
    effectLogicId: string = "BerserkerChargeAttackLogic"

    /** Level determines which charge attacks are available and what charge ratios are required at minimum to use this effect */
    private level = 0
    /** list of minimum charge ratios required based on level to use this effect */
    private chargeRatiosRequired = [1, 0.5, 0.33]

    private level1Multiplier = 5
    private level2Multiplier = 10
    private level3Multiplier = 10
    private getsugaMultiplier = 30

    private getsugaCount = 1

    public useEffect(playerState: Player, gameManager: GameManager, tree: WeaponUpgradeTree, playerBody: Matter.Body, {mouseX, mouseY}: {mouseX: number, mouseY: number}, chargeRatio: number): void {
        if(this.level === 0){
            if(chargeRatio >= this.chargeRatiosRequired[0]) this.level1ChargeAttack(playerState, gameManager, {mouseX, mouseY}) // Fully charged
        }
        else if(this.level === 1){
            if(chargeRatio >= this.chargeRatiosRequired[0]) this.level2ChargeAttack(playerState, gameManager, {mouseX, mouseY}) // Fully charged
            else if(chargeRatio >= this.chargeRatiosRequired[1]) this.level1ChargeAttack(playerState, gameManager, {mouseX, mouseY}) // Partially charged
        }
        else if(this.level === 2){
            if(chargeRatio >= this.chargeRatiosRequired[0]) this.level3ChargeAttack(playerState, gameManager, {mouseX, mouseY}) // Fully charged
            else if(chargeRatio >= this.chargeRatiosRequired[1]) this.level2ChargeAttack(playerState, gameManager, {mouseX, mouseY}) // Partially charged
            else if(chargeRatio >= this.chargeRatiosRequired[2]) this.level1ChargeAttack(playerState, gameManager, {mouseX, mouseY}) // Minimally charged
        
        }
    }

    /** Slashes in front and knocks back enemies */
    private level1ChargeAttack(playerState: Player, gameManager: GameManager, {mouseX, mouseY}: {mouseX: number, mouseY: number}){
        playerState.canMove = true

        let playerX = playerState.getBody().position.x
        let playerY = playerState.getBody().position.y
        let offsetX = 8
        // let offsetY = -Math.abs(90 - playerState.height)/2 - 2
        let offsetY = -25
        if(mouseX - playerState.getBody().position.x < 0) offsetX *= -1

        playerState.animation.playAnimation("Double_Slash", {
            // duration: 1 / getFinalChargeAttackSpeed(playerState.stat)
            duration: 0.5,
            flip: offsetX < 0
        })

        let projectileConfig: IProjectileConfig = {
            sprite: "invisible",
            stat: playerState.stat,
            spawnX: playerX + offsetX,
            spawnY: playerY + offsetY,
            initialVelocity: {x: 0, y: 0},
            collisionCategory: "PLAYER_PROJECTILE",
            poolType: "Berserker Charge 1",
            activeTime: 500,
            attackMultiplier: this.level1Multiplier,
            magicMultiplier: 0,
            originEntityId: playerState.getId(),
            spawnSound: "sword_swish",
            width: 210,
            height: 50,
            visible: false,
            classType: "MeleeProjectile"
        }

        gameManager.getEventEmitter().emit(GameEvents.SPAWN_PROJECTILE, projectileConfig);
    }

    /** Slashes in front and behind and knocks back enemies */
    private level2ChargeAttack(playerState: Player, gameManager: GameManager, {mouseX, mouseY}: {mouseX: number, mouseY: number}){
        playerState.canMove = false
        
        let playerX = playerState.getBody().position.x
        let playerY = playerState.getBody().position.y
        let offsetX = 50
        // let offsetY = -Math.abs(90 - playerState.height)/2 - 2
        let offsetY = -10
        if(mouseX - playerState.getBody().position.x < 0) offsetX *= -1

        playerState.animation.playAnimation("sp_atk", {
            // duration: 1 / getFinalChargeAttackSpeed(playerState.stat)
            duration: 0.5,
            flip: offsetX < 0
        })

        let projectileConfig: IProjectileConfig = {
            sprite: "invisible",
            stat: playerState.stat,
            spawnX: playerX + offsetX,
            spawnY: playerY + offsetY,
            initialVelocity: {x: 0, y: 0},
            collisionCategory: "PLAYER_PROJECTILE",
            poolType: "Berserker Charge 2",
            activeTime: 500,
            attackMultiplier: this.level2Multiplier,
            magicMultiplier: 0,
            originEntityId: playerState.getId(),
            spawnSound: "flame_slash",
            width: 100,
            height: 100,
            visible: false,
            classType: "MeleeProjectile"
        }

        gameManager.getEventEmitter().emit(GameEvents.SPAWN_PROJECTILE, projectileConfig);
    }

    /** Perform a large flame slash that slashes out a projectile(getsuga tenshou) */
    private level3ChargeAttack(playerState: Player, gameManager: GameManager, {mouseX, mouseY}: {mouseX: number, mouseY: number}){

        let playerX = playerState.getBody().position.x
        let playerY = playerState.getBody().position.y
        let offsetX = 50
        let offsetY = 0

        if(mouseX - playerState.getBody().position.x < 0) offsetX *= -1

        playerState.animation.playAnimation("sp_atk", {
            duration: 0.5,
            flip: offsetX < 0
        })

        let projectileConfig: IProjectileConfig = {
            sprite: "invisible",
            stat: playerState.stat,
            spawnX: playerX + offsetX,
            spawnY: playerY + offsetY,
            initialVelocity: {x: 0, y: 0},
            collisionCategory: "PLAYER_PROJECTILE",
            poolType: "Berserker Charge 2",
            activeTime: 500,
            attackMultiplier: this.level3Multiplier,
            magicMultiplier: 0,
            originEntityId: playerState.getId(),
            spawnSound: "flame_slash",
            width: 100,
            height: 100,
            visible: false,
            classType: "MeleeProjectile"
        }

        gameManager.getEventEmitter().emit(GameEvents.SPAWN_PROJECTILE, projectileConfig);

        projectileConfig = {
            sprite: "GetsugaTenshou",
            stat: playerState.stat,
            spawnX: playerX + offsetX,
            spawnY: playerY + offsetY,
            initialVelocity: MathUtil.getNormalizedSpeed(mouseX - playerX, mouseY - playerY, 10),
            collisionCategory: "PLAYER_PROJECTILE",
            poolType: "Getsuga Tenshou",
            activeTime: 2000,
            attackMultiplier: this.getsugaMultiplier,
            magicMultiplier: 0,
            originEntityId: playerState.getId(),
            // spawnSound: this.spawnSound,
            width: 100,
            height: 100,
            // piercing: -1,
            dontDespawnOnObstacleCollision: true,
            classType: "MeleeProjectile",
            spawnSound: "magic_slash"
        }

        this.fireGetsuga(playerState, gameManager, {mouseX, mouseY}, projectileConfig)
    }

    public chargeThresholdReached(chargeRatio: number): boolean {
        return chargeRatio >= this.chargeRatiosRequired[this.level]
    }

    public incrementLevel(){
        this.level += 1
    }

    public incrementGetsugaCount(){
        this.getsugaCount += 1
    }

    public getChargeAnimation(chargeRatio: number){
        let animations = ["Charge_1", "Charge_2", "Charge_3"]
        
        // Returns the animation with the highest Charge Ratio met based on levels. So animation is to show that the charge attack is ready.
        for(let i=0;i<=this.level;i++){
            if(chargeRatio > this.chargeRatiosRequired[i]) return animations[this.level - i]
        }

        return ""
    }

    fireGetsuga(playerState: Player, gameManager: GameManager, {mouseX, mouseY}: {mouseX: number, mouseY: number}, projectileConfig: IProjectileConfig){
        let maximumProjectileCount = this.getsugaCount
        let rotationIncrement = 30
        let evenStartDeg = rotationIncrement * 0.5 + rotationIncrement * (maximumProjectileCount/2 - 1)
        let oddStartDeg = rotationIncrement * Math.floor(maximumProjectileCount/2)
        let rotationDeg = maximumProjectileCount %2 === 0? evenStartDeg : oddStartDeg
        let velX = mouseX - playerState.getBody().position.x
        let velY = mouseY - playerState.getBody().position.y

        // Spawns 1 or multiple projectiles
        for(let i=0;i<maximumProjectileCount;i++){
            // console.log(rotationDeg) 
            gameManager.getEventEmitter().emit(GameEvents.SPAWN_PROJECTILE, {
                ...projectileConfig,
                initialVelocity: MathUtil.getRotatedSpeed(velX, velY, 10, rotationDeg)
            })
            
            rotationDeg -= rotationIncrement
        }
    }
}
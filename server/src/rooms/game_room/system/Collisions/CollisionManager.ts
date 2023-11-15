import EffectFactory from "../../schemas/effects/EffectFactory";
import Entity from "../../schemas/gameobjs/Entity";
import Projectile from "../../schemas/projectiles/Projectile";
import GameManager from "../GameManager";
import EffectManager from "../StateManagers/EffectManager";
import { getTrueAttackDamage, getFinalLifeSteal, getTrueMagicDamage, getRemainingShieldAndDamageFromCollision } from "../Formulas/formulas";
import { CategoryType, getCategoryType } from "./Category";
import { ICollisionRule } from "../interfaces";
import Tile from "../../schemas/gameobjs/Tile";
import Player from "../../schemas/gameobjs/Player";
import MeleeProjectile from "../../schemas/projectiles/specialprojectiles/MeleeProjectile";
import Aura from "../../schemas/gameobjs/aura/Aura";
import Matter from "matter-js";
import MathUtil from "../../../../util/MathUtil";
import Chest from "../../schemas/gameobjs/chest/Chest";

export default class CollisionManager{
    private gameManager: GameManager

    private collisionRules: ICollisionRule[] = [
        // Projectile Collisions
        {typeA: "PLAYER_PROJECTILE", typeB: "MONSTER", resolve: this.resolveProjectileCollision},
        {typeA: "MONSTER_PROJECTILE", typeB: "PLAYER", resolve: this.resolveProjectileCollision},
        {typeA: "DAMAGE_ALL_PROJECTILE", typeB: "PLAYER", resolve: this.resolveProjectileCollision},
        {typeA: "DAMAGE_ALL_PROJECTILE", typeB: "MONSTER", resolve: this.resolveProjectileCollision},

        // Obstacle collisions
        {typeA: "PLAYER_PROJECTILE", typeB: "OBSTACLE", resolve: this.resolveProjectileObstacleCollision},
        {typeA: "MONSTER_PROJECTILE", typeB: "OBSTACLE", resolve: this.resolveProjectileObstacleCollision},
        {typeA: "DAMAGE_ALL_PROJECTILE", typeB: "OBSTACLE", resolve: this.resolveProjectileObstacleCollision},
        {typeA: "PLAYER", typeB: "OBSTACLE", resolve: this.resolveObstacleCollision},
        {typeA: "MONSTER", typeB: "OBSTACLE", resolve: this.resolveObstacleCollision},
        {typeA: "PET", typeB: "OBSTACLE", resolve: this.resolveObstacleCollision},

        // *** TODO create resolve functions for collisions below ***
        // Other Player collision
        {typeA: "PLAYER", typeB: "MONSTER", resolve: ()=>{}},
        {typeA: "PLAYER", typeB: "PET", resolve: ()=>{}},
        {typeA: "PLAYER", typeB: "NPC", resolve: ()=>{}},
        {typeA: "PLAYER", typeB: "CHEST", resolve: ()=>{}},
        {typeA: "PLAYER", typeB: "ITEM", resolve: ()=>{}},
        {typeA: "PLAYER", typeB: "PLAYER_BARRIER", resolve: ()=>{}},

        // Other Pet Collisions
        {typeA: "PET", typeB: "CHEST", resolve: ()=>{}},
        {typeA: "PET", typeB: "ITEM", resolve: ()=>{}},

        // Aura Collisions
        {typeA: "PLAYER", typeB: "AURA", resolve: this.resolveAuraCollision},
        {typeA: "MONSTER", typeB: "AURA", resolve: this.resolveAuraCollision},

        // Chest Collisions
        {typeA: "PLAYER", typeB: "CHEST", resolve: this.resolveChestCollision},

        // **TODO** Add more 
    ]

    /** Collision Rules for collisionEnd events */
    private collisionEndRules: ICollisionRule[] = [
        // Aura Collisions
        {typeA: "PLAYER", typeB: "AURA", resolve: this.resolveAuraCollisionEnd},
        {typeA: "MONSTER", typeB: "AURA", resolve: this.resolveAuraCollisionEnd},
    ];

    constructor(gameManager: GameManager){
        this.gameManager = gameManager
    }

    public resolveCollisions(bodyA: Matter.Body, bodyB: Matter.Body){
        // Get Category number
        let categoryNumberA = bodyA.collisionFilter.category
        let categoryNumberB = bodyB.collisionFilter.category

        if(categoryNumberA === undefined || categoryNumberB === undefined) return

        // Sort body by the category, bodyA will be one with smaller category
        if(categoryNumberA > categoryNumberB){
            // Swap matter bodies
            let temp = bodyA
            bodyA = bodyB
            bodyB = temp

            // Swap category numbers
            let temp2 = categoryNumberA
            categoryNumberA = categoryNumberB
            categoryNumberB = temp2
        }

        // Get Category type/string
        let categoryA = getCategoryType(categoryNumberA)
        let categoryB = getCategoryType(categoryNumberB)

        // Get each matterBody's corresponding gameObjects
        let gameObjectA = this.gameManager.gameObjects.get(bodyA.id)
        let gameObjectB = this.gameManager.gameObjects.get(bodyB.id)

        // Find collision match and resolve the collision
        this.collisionRules.forEach(({typeA, typeB, resolve})=>{
            // Order is based on what appears first/category number of the matter bodies's collision filter.
            // Check Category.ts to see order
            if((typeA === categoryA && typeB === categoryB)){
                //console.log(`${typeA}, ${typeB}`)
                resolve(gameObjectA, gameObjectB, bodyA, bodyB)
                return
            }
        })
    }

    public resolveCollisionEnd(bodyA: Matter.Body, bodyB: Matter.Body) {
        // Get Category number
        let categoryNumberA = bodyA.collisionFilter.category
        let categoryNumberB = bodyB.collisionFilter.category

        if(categoryNumberA === undefined || categoryNumberB === undefined) return

        // Sort body by the category, bodyA will be one with smaller category
        if(categoryNumberA > categoryNumberB){
            // Swap matter bodies
            let temp = bodyA
            bodyA = bodyB
            bodyB = temp

            // Swap category numbers
            let temp2 = categoryNumberA
            categoryNumberA = categoryNumberB
            categoryNumberB = temp2
        }

        // Get Category type/string
        let categoryA = getCategoryType(categoryNumberA)
        let categoryB = getCategoryType(categoryNumberB)

        // Get each matterBody's corresponding gameObjects
        let gameObjectA = this.gameManager.gameObjects.get(bodyA.id)
        let gameObjectB = this.gameManager.gameObjects.get(bodyB.id)

        // Find collision match and resolve the collision
        this.collisionEndRules.forEach(({typeA, typeB, resolve})=>{
            // Order is based on what appears first/category number of the matter bodies's collision filter.
            // Check Category.ts to see order
            if((typeA === categoryA && typeB === categoryB)){
                //console.log(`${typeA}, ${typeB}`)
                resolve(gameObjectA, gameObjectB, bodyA, bodyB)
            }
        })
    }

    /**
     * Takes in an Entity and a Projectile that collided and handles the collision logic
     * @param entity 
     * @param projectile 
     */
    public resolveProjectileCollision(projectile: Projectile, entity: Entity, bodyA: Matter.Body, bodyB: Matter.Body){
        // Do nothing if the projectile is not active. This is to prevent a projectile from hitting more than one monster.
        if(!projectile.active) return;

        // If entity fired projectile they wont get hit
        if(entity.getId() === projectile.originEntityId) return

        let trueAttackDamage = getTrueAttackDamage(projectile.stat, entity.stat, projectile.attackMultiplier)
        let trueMagicDamage = getTrueMagicDamage(projectile.stat, entity.stat, projectile.magicMultiplier)

        // if(entity instanceof Player) {
        //     console.log("Player hit, ", trueAttackDamage + trueMagicDamage);
        //     console.log(entity.stat.hp);
        // }
        // console.log(`Collision detected: attack:${trueAttackDamage}, magic:${trueMagicDamage}, player armor: ${entity.stat.armor}`);

        // Entity colliding with projectile takes attack and magic damage
        // console.log(`true attack damage ${trueAttackDamage}, trueMagicdmg ${trueMagicDamage}. (Note: Before Shield is applied)`)
        
        // Reduce attack damage based on shield
        let {shieldHp: shieldHpAfterAttack, damage: attackDamageLeft} = getRemainingShieldAndDamageFromCollision(entity.stat.shieldHp, trueAttackDamage)
        let damageEffect = EffectFactory.createDamageEffect(Math.floor(attackDamageLeft), projectile.originEntityId)
        EffectManager.addEffectsTo(entity, damageEffect)

        // Reduce magic attack damage based on remaining shield
        let {shieldHp: shieldHpAfterMagicAttack, damage: magicDamageLeft} = getRemainingShieldAndDamageFromCollision(shieldHpAfterAttack, trueMagicDamage)
        damageEffect = EffectFactory.createDamageEffect(Math.floor(magicDamageLeft), projectile.originEntityId)
        EffectManager.addEffectsTo(entity, damageEffect)

        // console.log(`Player shield before attack: ${entity.stat.shieldHp}`)
        entity.stat.shieldHp = Math.floor(shieldHpAfterMagicAttack < 0? 0 : shieldHpAfterMagicAttack)
        // console.log(`Player shield after attack: ${entity.stat.shieldHp}`)

        // Entity shooting projectile heals based on their lifesteal
        let attackingEntity = projectile.entity
        if(attackingEntity){
            let lifeSteal = getFinalLifeSteal(trueAttackDamage, attackingEntity.stat.lifeSteal, attackingEntity.stat.lifeStealPercent)
            let healEffect = EffectFactory.createHealEffect(Math.floor(lifeSteal))
            //console.log("lifesteal:", lifeSteal)
            EffectManager.addEffectsTo(attackingEntity, healEffect)
        }

        projectile.onCollide()

        // Melee projectile will be set inactive by its controller.
        projectile.hitCount++
        let exceededHitCount = projectile.hitCount === projectile.piercing
        if(exceededHitCount){
            if(!(projectile instanceof MeleeProjectile)) {
                projectile.setInactive();
                let body = projectile.getBody()
                Matter.Body.setVelocity(body, {x: 0, y:0})
            }
            else projectile.disableCollisions();
        }
        
        // Apply knockback
        if(projectile.knockback && projectile instanceof MeleeProjectile) {
            if(projectile instanceof MeleeProjectile) {
                let direction = projectile.knockback.direction;
                if(direction) {
                    direction = MathUtil.normalize(direction);
                } else {
                    direction = {x: 1, y: 0}
                }
                let entityPosition = entity.getBody().position;
                Matter.Body.setPosition(entity.getBody(), {
                    x: entityPosition.x + projectile.knockback.distance * direction.x,
                    y: entityPosition.y + projectile.knockback.distance * direction.y,
                })
            } else {
                // TODO: Handle knockback for all other projectiles.
            }
            
        }
    }

    public resolveProjectileObstacleCollision(projectile: Projectile, obstacle: Tile, bodyA: Matter.Body, bodyB: Matter.Body){  
        // MeleeProjectiles and projectiles marked with dontDespawnOnObstacleCollision dont go inactive when an obstacle
        if(!(projectile instanceof MeleeProjectile) && !projectile.dontDespawnOnObstacleCollision)projectile.setInactive()
    }

    public resolveObstacleCollision(){
    }

    public resolveAuraCollision(entity: Entity, aura: Aura, bodyA: Matter.Body, bodyB: Matter.Body) {
        aura.auraController.onEnterAura(entity);
    }

    public resolveAuraCollisionEnd(entity: Entity, aura: Aura, bodyA: Matter.Body, bodyB: Matter.Body) {
        aura.auraController.onExitAura(entity);
    }

    public resolveChestCollision(player: Player, chest: Chest, bodyA: Matter.Body, bodyB: Matter.Body) {
        chest.openChest(player);
    }
}
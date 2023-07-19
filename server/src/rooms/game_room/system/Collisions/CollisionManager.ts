import EffectFactory from "../../schemas/effects/EffectFactory";
import Entity from "../../schemas/gameobjs/Entity";
import Projectile from "../../schemas/projectiles/Projectile";
import GameManager from "../GameManager";
import EffectManager from "../StateManagers/EffectManager";
import { getTrueAttackDamage, getFinalLifeSteal, getTrueMagicDamage } from "../Formulas/formulas";
import { CategoryType, getCategoryType } from "./Category";
import { ICollisionRule } from "../interfaces";
import Tile from "../../schemas/gameobjs/Tile";
import Player from "../../schemas/gameobjs/Player";
import MeleeProjectile from "../../schemas/projectiles/specialprojectiles/MeleeProjectile";

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

        // **TODO** Add more 
    ]

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

    /**
     * Takes in an Entity and a Projectile that collided and handles the collision logic
     * @param entity 
     * @param projectile 
     */
    public resolveProjectileCollision(projectile: Projectile, entity: Entity, bodyA: Matter.Body, bodyB: Matter.Body){
        let trueAttackDamage = getTrueAttackDamage(projectile.stat, entity.stat, projectile.attackMultiplier)
        let trueMagicDamage = getTrueMagicDamage(projectile.stat, entity.stat, projectile.magicMultiplier)

        // if(entity instanceof Player) {
        //     console.log("Player hit, ", trueAttackDamage + trueMagicDamage);
        //     console.log(entity.stat.hp);
        // }
        // console.log(`Collision detected: attack:${trueAttackDamage}, magic:${trueMagicDamage}, player armor: ${entity.stat.armor}`);

        // Entity colliding with projectile takes attack and magic damage
        let damageEffect = EffectFactory.createDamageEffect(trueAttackDamage)
        EffectManager.addEffectsTo(entity, damageEffect)

        damageEffect = EffectFactory.createDamageEffect(trueMagicDamage)
        EffectManager.addEffectsTo(entity, damageEffect)

        // Entity shooting projectile heals based on their lifesteal
        let attackingEntity = projectile.entity
        if(attackingEntity){
            let lifeSteal = getFinalLifeSteal(trueAttackDamage, attackingEntity.stat.lifeSteal)
            let healEffect = EffectFactory.createHealEffect(lifeSteal)
            //console.log("lifesteal:", lifeSteal)
            EffectManager.addEffectsTo(attackingEntity, healEffect)
        }

        // Melee projectile will be set inactive by its controller.
        if(!(projectile instanceof MeleeProjectile)) projectile.setInactive();
        else projectile.disableCollisions();
    }

    public resolveProjectileObstacleCollision(projectile: Projectile, obstacle: Tile, bodyA: Matter.Body, bodyB: Matter.Body){
        projectile.setInactive()
    }

    public resolveObstacleCollision(){
    }
}
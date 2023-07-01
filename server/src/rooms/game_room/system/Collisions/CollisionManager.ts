import EffectFactory from "../../schemas/effects/EffectFactory";
import Entity from "../../schemas/gameobjs/Entity";
import Projectile from "../../schemas/projectiles/Projectile";
import GameManager from "../GameManager";
import EffectManager from "../StateManagers/EffectManager";
import { getFinalAttackDamage, getFinalLifeSteal } from "../formulas";
import { CategoryType, getCategoryType } from "./Category";

export default class CollisionManager{
    private gameManager: GameManager

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
        let typeA = getCategoryType(categoryNumberA)
        let typeB = getCategoryType(categoryNumberB)

        // Get each matterBody's corresponding gameObjects
        let gameObjectA = this.gameManager.gameObjects.get(bodyA.id)
        let gameObjectB = this.gameManager.gameObjects.get(bodyB.id)

        // Projectile and player/monster collision
        let playerProjectileCollision = typeA === "PLAYER_PROJECTILE" && typeB === "MONSTER"
        let monsterProjectileCollision = typeA === "MONSTER_PROJECTILE" && typeB === "PLAYER"
        let friendlyFireProjectileCollision = (typeA === "DAMAGE_ALL_PROJECTILE") && (typeB === "MONSTER" || typeB === "PLAYER")
        if(playerProjectileCollision || monsterProjectileCollision || friendlyFireProjectileCollision){
            return this.resolveProjectileCollision(gameObjectB as Entity, gameObjectA as Projectile)
        }

        // Obstacle collisions
        let collidesWithObstacles: CategoryType[] = [
            "PLAYER_PROJECTILE", 
            "MONSTER_PROJECTILE", 
            "DAMAGE_ALL_PROJECTILE",
            "PLAYER", "MONSTER", "PET"
        ]
        if(collidesWithObstacles.includes(typeA) && typeB === "OBSTACLE"){
            return
        }

        // Other Player collisions
        if(typeA === "PLAYER"){
            switch(typeB){
                case "MONSTER":
                    break;
                case "PET":
                    break;
                case "NPC":
                    break;
                case "CHEST":
                    break;
                case "ITEM":
                    break;
                case "PLAYER_BARRIER":
                    break;
                default:
                    break;
            }
            return
        }

        // Pet collisions
        if(typeA === "PET"){
            switch(typeB){
                case "CHEST":
                    break;
                case "ITEM":
                    break;
            }
            return
        }
    }

    /**
     * Takes in an Entity and a Projectile that collided and handles the collision logic
     * @param entity 
     * @param projectile 
     */
    public resolveProjectileCollision(entity: Entity, projectile: Projectile){
        let trueDamage = getFinalAttackDamage(projectile.stat, entity.stat)
        
        // Entity colliding with projectile takes damage
        let damageEffect = EffectFactory.createDamageEffect(trueDamage)
        EffectManager.addEffectsTo(entity, damageEffect)
        console.log("damage:", trueDamage)
        // Entity shooting projectile heals based on their lifesteal
        let attackingEntity = projectile.entity
        if(attackingEntity){
            let lifeSteal = getFinalLifeSteal(trueDamage, attackingEntity.stat.lifeSteal)
            let healEffect = EffectFactory.createHealEffect(lifeSteal)
            console.log("lifesteal:", lifeSteal)
            EffectManager.addEffectsTo(attackingEntity, healEffect)
        }
    }
}
import { CategoryType } from "../../../../../Collisions/Category";
import FireProjectileLogic from "../../../common/FireProjectileLogic";

export default class ChargeAttackLogic1 extends FireProjectileLogic{
    effectLogicId = "ChargeAttackLogic1"
    projectileCount = 1
    projectileName= "demo_hero"
    collisionCategory: CategoryType =  "PLAYER_PROJECTILE"
    poolType = "Charge Shot"
    spawnSound = "shoot_arrow"
    attackMultiplier = 5
    magicMultiplier = 0
    piercing = 20
}
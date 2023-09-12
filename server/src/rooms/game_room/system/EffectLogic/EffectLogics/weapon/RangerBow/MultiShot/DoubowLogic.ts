import { CategoryType } from "../../../../../Collisions/Category";
import FireProjectileLogic from "../../../common/FireProjectileLogic";

export default class DoubowLogic extends FireProjectileLogic{
    effectLogicId = "Doubow"
    projectileCount = 2
    projectileName= "RangerArrow"
    collisionCategory: CategoryType =  "PLAYER_PROJECTILE"
    poolType = "RangerArrow"
    spawnSound = "shoot_arrow"
    attackMultiplier = 1
    magicMultiplier = 0
}
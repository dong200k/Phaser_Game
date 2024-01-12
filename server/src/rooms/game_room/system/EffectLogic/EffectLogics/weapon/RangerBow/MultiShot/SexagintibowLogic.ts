import { CategoryType } from "../../../../../Collisions/Category";
import FireProjectileLogic from "../../../common/FireProjectileLogic";

export default class SexagintibowLogic extends FireProjectileLogic{
    effectLogicId = "Sexagintibow"
    projectileCount = 8
    projectileName= "RangerArrow"
    collisionCategory: CategoryType =  "PLAYER_PROJECTILE"
    poolType = "RangerArrow"
    spawnSound = "shoot_arrow"
    attackMultiplier = 1
    magicMultiplier = 0
}
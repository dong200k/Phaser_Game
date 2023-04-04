import {Categories, CategoryType } from "./Category"
class MaskManager {
    private masks: Map<CategoryType, number> = new Map()

    constructor(){
        // initialize collideable groups/mask for each category 
        Object.keys(Categories).forEach((category) => {
            this.masks.set(category as CategoryType, 0x0000)
        })
        this.initPlayerMasks()
        this.initMonsterMasks()
        this.initPetMasks()
        this.initObstacleMasks()
    }

    private initPlayerMasks(){
        this.setCollideable("PLAYER", "MONSTER")
        this.setCollideable("PLAYER", "PLAYER_PROJECTILE_FRIENDLY_FIRE")
        this.setCollideable("PLAYER", "MONSTER_PROJECTILE")
        this.setCollideable("PLAYER", "CHEST")
        this.setCollideable("PLAYER", "ITEM")
        this.setCollideable("PLAYER", "NPC")
    }

    private initMonsterMasks(){
        this.setCollideable("MONSTER", "PLAYER_PROJECTILE")
        this.setCollideable("MONSTER", "MONSTER_PROJECTILE_FRIENDLY_FIRE")
    }

    private initPetMasks(){
        this.setCollideable("PET", "ITEM")
    }

    private initObstacleMasks(){
        this.setCollideable("OBSTACLE", "PLAYER")
        this.setCollideable("OBSTACLE", "PET")
        this.setCollideable("OBSTACLE", "MONSTER")
        this.setCollideable("OBSTACLE", "PLAYER_PROJECTILE")
        this.setCollideable("OBSTACLE", "MONSTER_PROJECTILE")
    }

    /**
     * takes in 2 categories and makes them collideable with each other
     * @param category1 
     * @param category2 
     */
    private setCollideable(category1: CategoryType, category2: CategoryType){
        this.masks.set(category1, Categories[category2] | this.getMask(category1) as number)
        this.masks.set(category2, Categories[category1] | this.getMask(category2) as number)
    }

     /**
     * returns mask based on the input category if it exists else  0
     * @param category
     * @returns 
     */
     getMask(category: CategoryType){
        return this.masks.get(category)
    }
}

export default new MaskManager()
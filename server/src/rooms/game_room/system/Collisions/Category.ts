export let Categories = Object.freeze({
    // No Category aka doesnt collide
    'NONE': 0x0000,

    // Projectiles or Skills
    'PLAYER_PROJECTILE': 0x0001,
    // 'PLAYER_PROJECTILE_FRIENDLY_FIRE': 0x0002,
    'MONSTER_PROJECTILE': 0x0004,
    'DAMAGE_ALL_PROJECTILE': 0x0008, // collides with both monster and players

    // Entities
    'PLAYER': 0x0010,
    'MONSTER': 0x0020,
    'PET': 0x0040,
    'NPC': 0x0080,

    // Miscellaneous
    'CHEST': 0x0100,

    // Pickables
    'ITEM': 0x0200,

    // Terrain
    'OBSTACLE': 0x0400,
    'PLAYER_BARRIER': 0x0800,

    // Aura
    'AURA': 0x1000,

    // Forge
    'FORGE': 0x2000,

    // Merchant
    'MERCHANT': 0x4000,

    // Fountain
    'FOUNTAIN': 0x8000
})

const categoryTypes: {[index: number]: CategoryType} = {}
Object.entries(Categories).forEach(([key, val])=>{
    categoryTypes[val] = key as CategoryType
})

/**
 * Takes in a category number and returns the corresponding category type/string
 * @param category number representing category
 * @returns CategoryType connected to this number as defined in the Categories Object
 */
export function getCategoryType(category: number): CategoryType{
    return categoryTypes[category]
}

export type CategoryType = keyof typeof Categories
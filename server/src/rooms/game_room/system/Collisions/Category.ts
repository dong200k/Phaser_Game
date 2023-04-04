export let Categories = Object.freeze({
    // Projectiles or Skills
    'PLAYER_PROJECTILE': 0x0001,
    'PLAYER_PROJECTILE_FRIENDLY_FIRE': 0x0002,
    'MONSTER_PROJECTILE': 0x0004,
    'MONSTER_PROJECTILE_FRIENDLY_FIRE': 0x0008,

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
})

export type CategoryType = keyof typeof Categories
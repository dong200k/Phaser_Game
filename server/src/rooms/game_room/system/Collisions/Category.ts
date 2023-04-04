export let Categories = Object.freeze({
    // Projectiles or Skills
    'PLAYER_PROJECTILE': 0x0001,
    'PLAYER_PROJECTILE_FRIENDLY_FIRE': 0x0002,
    'MONSTER_PROJECTILE': 0x0003,
    'MONSTER_PROJECTILE_FRIENDLY_FIRE': 0x0004,

    // Entities
    'PLAYER': 0x0005,
    'MONSTER': 0x0006,
    'PET': 0x0007,
    'NPC': 0x0008,

    // Miscellaneous
    'CHEST': 0x0009,

    // Pickables
    'ITEM': 0x000A,

    // Terrain
    'OBSTACLE': 0x000B,
})

export type CategoryType = keyof typeof Categories
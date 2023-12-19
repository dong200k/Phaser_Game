/** Map of difficulty, states, and possible configs for BerserkerBossController states*/
/** The transformed state will have double the slashes and half the time between slashes */
export const difficultyMap = {
    "Easy": {
        /** Range of time to change states */
        timeRange: {min: 12, max: 15},
        /** Flame slash when boss stands still */
        "GetsugaSlash": {
            /** Sets of slashes performed. */
            slashCountRange: {min: 1, max: 2}, 
            /** Slashes fired each set */
            getsugaCountRange: {min: 1, max: 2},
            /** Time between the sets of slashes. Also determines duration */
            timeBetweenSlashes: 2,
        },
        /** Swings, and regular attacks */
        "Attack": {
        },
        /** Spinning and chase with getsugas flying out */
        "TornadoSpin": {
            /** Sets of slashes performed. */
            slashCountRange: {min: 1, max: 2},
            /** Slashes fired each set */
            getsugaCountRange: {min: 1, max: 2},
            /** Time between the sets of slashes */
            timeBetweenSlashes: 2,
            /** Duration of tornado spin (spin and chase) */
            attackDurationRange: {min: 2, max: 4},
        },
        /** Spin super fast stationary and send  */
        "FinalAttack": {
            /** range of the attack's duration */
            attackDurationRange: {min: 5, max: 5},
            /** Slashes fired */
            getsugaCountRange: {min: 10, max: 25},
        },
        /** Homing getsugas that chases the player */
        "FollowingGetsuga": {
            /** Sets of slashes performed. */
            slashCountRange: {min: 2, max: 3},
            /** Slashes fired each set */
            getsugaCountRange: {min: 1, max: 1},
            /** Time between the sets of slashes */
            timeBetweenSlashes: 2,
            /** Projectile speed range */
            projectileSpeedRange: {min: 1, max: 3},
            projectileActiveTime: 4000
        },
        /** Getsugas that follows and spins around the boss */
        "SpinningGetsuga": {
            /** Sets of slashes performed. */
            slashCountRange: {min: 1, max: 3},
            /** Time between the sets of slashes */
            timeBetweenSlashes: 2,
            /** Projectile speed range */
            projectileSpeedRange: {min: 1, max: 3},
            projectileActiveTime: 5000,
            radius: 200
        },
        "Idle": {}
    },
    "Medium": {
        /** Range of time to change states */
        timeRange: {min: 10, max: 12},
        /** Flame slash when boss stands still */
        "GetsugaSlash": {
            /** Sets of slashes performed. */
            slashCountRange: {min: 2, max: 4}, 
            /** Slashes fired each set */
            getsugaCountRange: {min: 2, max: 3},
            /** Time between the sets of slashes. Also determines duration */
            timeBetweenSlashes: 1.5,
        },
        /** Swings, and regular attacks */
        "Attack": {
        },
        /** Spinning and chase with getsugas flying out */
        "TornadoSpin": {
            /** Sets of slashes performed. */
            slashCountRange: {min: 2, max: 3},
            /** Slashes fired each set */
            getsugaCountRange: {min: 2, max: 2},
            /** Time between the sets of slashes */
            timeBetweenSlashes: 1.5,
            /** Duration of tornado spin (spin and chase) */
            attackDurationRange: {min: 4, max: 6},
        },
        /** Spin super fast stationary and send  */
        "FinalAttack": {
            /** range of the attack's duration */
            attackDurationRange: {min: 5, max: 5},
            /** Slashes fired */
            getsugaCountRange: {min: 25, max: 50},
        },
        /** Homing getsugas that chases the player */
        "FollowingGetsuga": {
            /** Sets of slashes performed. */
            slashCountRange: {min: 3, max: 4},
            /** Slashes fired each set */
            getsugaCountRange: {min: 1, max: 2},
            /** Time between the sets of slashes */
            timeBetweenSlashes: 1.5,
            /** Projectile speed range */
            projectileSpeedRange: {min: 3, max: 3},
            projectileActiveTime: 4000
        },
        /** Getsugas that follows and spins around the boss */
        "SpinningGetsuga": {
            /** Sets of slashes performed. */
            slashCountRange: {min: 2, max: 4},
            /** Time between the sets of slashes */
            timeBetweenSlashes: 1.5,
            /** Projectile speed range */
            projectileSpeedRange: {min: 2, max: 4},
            projectileActiveTime: 7000,
            radius: 200
        },
        "Idle": {}
    },
    "Hard": {
        /** Range of time to change states */
        timeRange: {min: 8, max: 10},
        /** Flame slash when boss stands still */
        "GetsugaSlash": {
            /** Sets of slashes performed. */
            slashCountRange: {min: 2, max: 4}, 
            /** Slashes fired each set */
            getsugaCountRange: {min: 6, max: 8},
            /** Time between the sets of slashes. Also determines duration */
            timeBetweenSlashes: 1,
        },
        /** Swings, and regular attacks */
        "Attack": {
        },
        /** Spinning and chase with getsugas flying out */
        "TornadoSpin": {
            /** Sets of slashes performed. */
            slashCountRange: {min: 2, max: 4},
            /** Slashes fired each set */
            getsugaCountRange: {min: 4, max: 4},
            /** Time between the sets of slashes */
            timeBetweenSlashes: 1,
            /** Duration of tornado spin (spin and chase) */
            attackDurationRange: {min: 5, max: 7},
        },
        /** Spin super fast stationary and send  */
        "FinalAttack": {
            /** range of the attack's duration */
            attackDurationRange: {min: 4, max: 4},
            /** Slashes fired */
            getsugaCountRange: {min: 100, max: 125},
        },
        /** Homing getsugas that chases the player */
        "FollowingGetsuga": {
            /** Sets of slashes performed. */
            slashCountRange: {min: 3, max: 3},
            /** Slashes fired each set */
            getsugaCountRange: {min: 1, max: 2},
            /** Time between the sets of slashes */
            timeBetweenSlashes: 1,
            /** Projectile speed range */
            projectileSpeedRange: {min: 5, max: 7},
            projectileActiveTime: 4000
        },
        /** Getsugas that follows and spins around the boss */
        "SpinningGetsuga": {
            /** Sets of slashes performed. */
            slashCountRange: {min: 6, max: 8},
            /** Time between the sets of slashes */
            timeBetweenSlashes: 0.5,
            /** Projectile speed range */
            projectileSpeedRange: {min: 6, max: 8},
            projectileActiveTime: 9000,
            radius: 200
        },
        "Idle": {}
    }
}
import MathUtil from "../../../../../util/MathUtil"

/**
 * This function will call the spawnProjectile argument/function with different rotated velocities 
 * @param spawnProjectile function that takes in a velocity and spawns a projectile
 * @param increment angle in degrees between each projectile
 * @param count amount of projectiles to spawn
 * @param x x part of the projectile's direction
 * @param y y part of the projectile's direction
 * @param projectileSpeed speed of the projectile
 * @param timeBetweenProjectile time in miliseconds between projectiles, default is 0
 */
export const spawnProjectilesRotated = (spawnProjectile: (velocity: {x: number, y: number})=>void, increment: number, count: number, x: number, y: number, projectileSpeed: number, timeBetweenProjectile: number = 0)=>{
    let maximumProjectileCount = count
    let rotationIncrement = increment
    let evenStartDeg = rotationIncrement * 0.5 + rotationIncrement * (maximumProjectileCount/2 - 1)
    let oddStartDeg = rotationIncrement * Math.floor(maximumProjectileCount/2)
    let rotationDeg = maximumProjectileCount %2 === 0? evenStartDeg : oddStartDeg
    let velX = x
    let velY = y
    const spawnFunction = (rotationDeg: number) => {
        return ()=>{
            // console.log(`spawn rotated projectile, count: ${count}, rotationDeg: ${rotationDeg}`)
            spawnProjectile(MathUtil.getRotatedSpeed(velX, velY, projectileSpeed, rotationDeg))
        }
    }
    // Spawns 1 or multiple projectiles
    for(let i=0;i<maximumProjectileCount;i++){
        
        setTimeout(spawnFunction(rotationDeg), i * timeBetweenProjectile)
    
        rotationDeg -= rotationIncrement
    }
}
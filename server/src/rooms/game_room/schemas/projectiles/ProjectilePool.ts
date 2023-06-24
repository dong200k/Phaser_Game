import { ObjectPool } from "../../../../util/PoolUtil";
import Projectile from "./Projectile";

/** ProjectilePool is a map of projectile pools. Since each projectile is connected to a Matter.Body, if there are
 * rectangle bodies or hexagonal bodies etc. then they will need their own pool. Another example is that a weapon that shoots
 * lasers may use a different projectile pool then a weapon that shoots bullets so the pool map will have both the laser
 * pool and the bullet pool.
 */
export default class ProjectilePool{

    private poolMap: Map<string, ObjectPool<Projectile>> = new Map()

    constructor(){
    }

    /**
     * For the special implementation, do not call getInstance if the length of the object pool is 0!!!
     * The idea is that a projectile will be created if there is no instance instead of cloned by the ObjectPool.
     * @param type string identifying the pool
     * @returns an instance of the pool
     */
    public getInstance(type: string){
        let pool = this.poolMap.get(type) as ObjectPool<Projectile>
        let instance = pool.getInstance();
        instance.setVisible(true);
        return instance;
    }

    /**
     * Returns a projectile instance back to the correct pool in poolmap based on the type param.
     * @param type string to identify the pool
     * @param instance instance to return to the pool for reuse
     */
    public returnInstance(type: string, instance: Projectile){
        instance.setVisible(false);
        let pool = this.poolMap.get(type) as ObjectPool<Projectile>
        pool.returnInstance(instance)
    }

    /**
     * @param type string to identify the pool
     * @returns true if the pool contains the type else false
     */
    public containsType(type: string): boolean{
        return this.poolMap.get(type) !== undefined
    }

    /**
     * Make sure that the pool type is unique. Adding pool type that exists will throw an error.
     * @param type string to identify the pool
     * @param prototype 
     */
    public addPoolType(type: string){
        if(this.poolMap.get(type)) throw new Error(`Error, pool of type ${type} already exists in pool map!`)

        // Prototype is not used in this implementation
        let prototype: unknown = undefined
        let pool = new ObjectPool<Projectile>(prototype as Projectile)
        this.poolMap.set(type, pool)
    }

    /**
     * 
     * @param type string to identify the pool
     * @returns the pool associated with type
     */
    public getPool(type:string){
        return this.poolMap.get(type)
    }
}
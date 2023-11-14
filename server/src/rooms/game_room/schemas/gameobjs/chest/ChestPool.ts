import { ObjectPool } from "../../../../../util/PoolUtil";
import Chest from "./Chest";

/** ChestPool is used to store reuseable Chest objects. */
export default class ChestPool {

    private poolMap: Map<string, ObjectPool<Chest>> = new Map()

    constructor(){
    }

    /**
     * For the special implementation, do not call getInstance if the length of the object pool is 0!!!
     * The idea is that a object will be created if there is no instance instead of cloned by the ObjectPool.
     * @param type string identifying the pool
     * @returns an instance of the pool
     */
    public getInstance(type: string){
        let pool = this.poolMap.get(type) as ObjectPool<Chest>;
        let instance = pool.getInstance();
        instance.setInPoolMap(false);
        return instance;
    }

    /**
     * Returns a instance back to the correct pool in poolmap based on the type param. The 
     * returned instance will have its inPoolMap field set to true.
     * @param type string to identify the pool
     * @param instance instance to return to the pool for reuse
     */
    public returnInstance(type: string, instance: Chest){
        let pool = this.poolMap.get(type) as ObjectPool<Chest>;
        instance.setInPoolMap(true);
        pool.returnInstance(instance);
    }

    /**
     * @param type string to identify the pool
     * @returns true if the pool contains the type else false
     */
    public containsType(type: string): boolean{
        return this.poolMap.get(type) !== undefined;
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
        let pool = new ObjectPool<Chest>(prototype as Chest)
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
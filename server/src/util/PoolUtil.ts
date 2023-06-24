
export interface Cloneable {
    clone:() => this;
}

export class ObjectPool<T extends Cloneable> {
    private poolQueue: Array<T>;
    private objectsCreated: number;
    private prototype: T;

    constructor(prototype: T) {
        this.poolQueue = new Array<T>();
        this.objectsCreated = 0;
        this.prototype = prototype;
    }

    public getInstance(): T {
        let obj = this.poolQueue.shift();
        if(obj === undefined) {
            obj = this.prototype.clone();
            this.objectsCreated++;
        }
        return obj;
    }

    public returnInstance(object: T): void {
        this.poolQueue.push(object);
    }

    public getObjectsCreated(): number {
        return this.objectsCreated;
    }

    public length(): number {
        return this.poolQueue.length
    }
}


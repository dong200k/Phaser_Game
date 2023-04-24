
export default class MathUtil {
    private static uidCounter = 0;
    
    /**Returns a uniquie id. This id is only unique in this project execution. The uid will reset on project start. */
    public static uid(): string {
        this.uidCounter += 1;
        return `UID#${this.uidCounter}`; //TODO: may cause conflicts with colyseus client's sessionId.
    }

    /**
     * 
     * @param x x direction
     * @param y y direction
     * @param speed speed multiplier
     * @returns normalized speed in direction <x,y>
     */
    public static getNormalizedSpeed(x: number, y: number, speed: number){
        let mag = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
        if(mag===0) return {x: 0, y: 0}
        return {x: x/mag * speed, y: y/mag * speed}
    }
}
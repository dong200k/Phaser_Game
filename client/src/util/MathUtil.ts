
export default class MathUtil {
    
    /**
     * @param min The min value
     * @param max The max value
     * @returns A random number between min and max inclusive
     */
    public static generateRandomInteger(min:number, max:number) {
        return Math.floor(Math.random() * (max-min)) + min;
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
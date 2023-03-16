
export default class MathUtil {
    
    /**
     * @param min The min value
     * @param max The max value
     * @returns A random number between min and max inclusive
     */
    public static generateRandomInteger(min:number, max:number) {
        return Math.floor(Math.random() * (max-min)) + min;
    }
}
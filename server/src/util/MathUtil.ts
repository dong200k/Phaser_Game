import { randomUUID } from "crypto";

export default class MathUtil {
    private static uidCounter = 0;
    
    /**Returns a uniquie id. This id is only unique in this project execution. The uid will reset on project start. */
    public static uid(): string {
        // this.uidCounter + 1;
        // return `UID#${this.uidCounter}`; //TODO: may cause conflicts with colyseus client's sessionId.
        return randomUUID();
    }

    /**
     * 
     * @param x x direction
     * @param y y direction
     * @param speed speed multiplier
     * @returns normalized speed in direction <x,y> multiplied by speed
     */
    public static getNormalizedSpeed(x: number, y: number, speed: number){
        let mag = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
        if(mag===0) return {x: 0, y: 0}
        return {x: x/mag * speed, y: y/mag * speed}
    }

    /**
     * 
     * @param x x direction
     * @param y y direction
     * @param speed speed multiplier
     * @param rotationDegree angle to rotate in degrees
     * @returns normalized speed in direction <x,y> rotated by degrees, multiplied by speed
     */
    public static getRotatedSpeed(x: number, y: number, speed: number, rotationDegree: number){
        let radians = rotationDegree * Math.PI/180

        let direction = MathUtil.getNormalizedSpeed(x, y, 1)
        let angle = Math.acos(direction.x) + radians
        if(direction.y < 0) angle = -angle
        let rotatedX = Math.cos(angle)
        let rotatedY = Math.sin(angle)
        return {x: rotatedX * speed, y: rotatedY * speed}
    }   

    /**
     * Round to the provided decimal place. (E.g. If number = 100.2222 and dp = 2 then return 100.22)
     * @param number The number to round.
     * @param dp The decimal place to round to. dp should not be negative.
     */
    public static roundDecimal(number:number, dp: number) {
        if(dp < 0) return number;
        number = number * Math.pow(10, dp);
        return Math.round(number) / Math.pow(10, dp);
    }
    
    /**
     * @param x1 The x1 value.
     * @param y1 The y1 value.
     * @param x2 The x2 value.
     * @param y2 The y2 value.
     * @returns Returns the distance squared of two points.
     */
    public static distanceSquared(x1:number, y1:number, x2:number, y2:number) {
        return Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2);
    }

    /**
     * @param x1 The x1 value.
     * @param y1 The y1 value.
     * @param x2 The x2 value.
     * @param y2 The y2 value.
     * @returns Returns the distance of two points.
     */
    public static distance(x1:number, y1:number, x2:number, y2:number) {
        return Math.sqrt(this.distanceSquared(x1,y1,x2,y2));
    }

    /**
     * Normalize a vector2. If the vector is a zero vector, a zero vector is returned.
     * @param vector2 The vector2.
     */
    public static normalize(vector2: {x: number, y: number}) {
        let distance = this.distance(0, 0, vector2.x, vector2.y);
        if(distance === 0) return {x: 0, y: 0};
        return {x: vector2.x / distance, y: vector2.y / distance};
    }

    /**
     * Takes in a velocity and returns the absolute speed of the velocity
     * @param velocity 
     */
    public static getSpeedFromVelocity({x, y}: {x: number, y: number}){
        return Math.sqrt(x*x + y*y)
    }

    /**
     * Gets a random integer between the min and max (inclusive).
     * @param min A min integer.
     * @param max A max integer.
     * @returns A integer between min and max.
     */
    public static getRandomIntegerBetween(min: number, max: number) {
        let range = (max - min) + 1;
        return Math.floor((Math.random() * range) + min);
    }
}
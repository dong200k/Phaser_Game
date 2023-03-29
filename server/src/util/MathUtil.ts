
export default class MathUtil {
    private static uidCounter = 0;
    
    /**Returns a uniquie id. This id is only unique in this project execution. The uid will reset on project start. */
    public static uid(): string {
        this.uidCounter + 1;
        return `UID#${this.uidCounter}`;
    }
}
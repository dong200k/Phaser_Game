import Aura from "../../schemas/gameobjs/aura/Aura";
import AuraPool from "../../schemas/gameobjs/aura/AuraPool";
import GameManager from "../GameManager";
import { IAuraConfig } from "../interfaces";


export default class AuraManager {
    
    private gameManager: GameManager;
    private auraPool: AuraPool;

    constructor(gameManager: GameManager) {
        this.gameManager = gameManager;
        this.auraPool = new AuraPool();
        setTimeout(() => {
            this.spawnAura({});
        }, 3000);
        
    }

    spawnAura(config: IAuraConfig) {
        let aura: Aura;
        let poolType = config.name ?? "aura";

        // Create the pool if it doesn't exist
        if(!this.auraPool.containsType(poolType)){
            this.auraPool.addPoolType(poolType)
        }

        // If the pool exists and contains at least 1 instance
        let pool = this.auraPool.getPool(poolType)
        if(pool && pool.length() > 0){
            // Get and reuse instance
            aura = this.auraPool.getInstance(poolType)
            aura.initialize(config)
        }else{
            // no instance so create new projectile
            aura = new Aura(this.gameManager, config.x ?? 0, config.y ?? 0);
            aura.initialize(config);
            let body = aura.getBody() as Matter.Body
            this.gameManager.addGameObject(aura.id, aura, body);
        }

        return {aura: aura, body: aura.getBody() as Matter.Body}
    }

}
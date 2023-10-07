import Aura from "../../schemas/gameobjs/aura/Aura";
import AuraFactory from "../../schemas/gameobjs/aura/AuraFactory";
import AuraPool from "../../schemas/gameobjs/aura/AuraPool";
import GameManager from "../GameManager";
import { IAuraConfig } from "../interfaces";


export default class AuraManager {
    
    private gameManager: GameManager;
    private auraPool: AuraPool;

    constructor(gameManager: GameManager) {
        this.gameManager = gameManager;
        this.auraPool = new AuraPool();
        // setTimeout(() => {
        //     this.spawnAura({
        //         name: "ArmorAura"
        //     }, (gameManager) => {
        //         return AuraFactory.createAura(gameManager, "ArmorAura", {armor: 100000, collisionTargets:["PLAYER"]});
        //     }).aura.auraController.setFollowTarget(gameManager.getPlayerManager().getNearestPlayer(0,0));
        // }, 3000);
    }

    /**
     * Perform updates on the aura manager. 
     * @param deltaT 
     */
    public update(deltaT: number) {
        this.gameManager.state.gameObjects.forEach((gameObject, key)=>{
            if(gameObject instanceof Aura){
                gameObject.auraController.update(deltaT);
            }
        })
    }

    /**
     * Spawns an new aura. If there is an existing aura with the same name in the AuraPool
     * it will be reused. You can create your own aura by passing in a builder function
     * that returns an aura (Note: The builder function won't be used if there is an 
     * existing aura with the same name in the AuraPool). 
     * @param config The IAuraConfig.
     * @param builder The builder function to create the aura with. 
     * @returns The spawned Aura.
     */
    public spawnAura(config: IAuraConfig, builder?: (gameManager: GameManager) => Aura) {
        let aura: Aura;
        let poolType = config.name ?? "Aura";

        // Create the pool if it doesn't exist
        if(!this.auraPool.containsType(poolType)){
            this.auraPool.addPoolType(poolType);
        }

        // If the pool exists and contains at least 1 instance
        let pool = this.auraPool.getPool(poolType);
        if(pool && pool.length() > 0){
            // Get and reuse instance
            aura = this.auraPool.getInstance(poolType);
            aura.setConfig(config);
        }else{
            // no instance so create new projectile
            if(builder) 
                aura = builder(this.gameManager);
            else 
                aura = new Aura(this.gameManager, config);
            let body = aura.getBody() as Matter.Body;
            this.gameManager.addGameObject(aura.id, aura, body);
        }

        return {aura: aura, body: aura.getBody() as Matter.Body};
    }

}
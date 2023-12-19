import GameManager from "../../../system/GameManager";
import Wave from "./Wave";

export interface ISafeWaveConfig {
    forgeSpawnPosition?: {x: number, y: number},
    merchantSpawnPosition?: {x: number, y: number},
    fountainSpawnPosition?: {x: number, y: number},
    /** Duration in seconds of the safewave */
    waveDuration?: number,
    hasMerchant?: boolean,
    hasForge?: boolean,
    hasFountain?: boolean,
}

export default class SafeWave extends Wave{
    private timeSoFar = 0
    private waveDurationSeconds = 15
    private waveStarted = false
    private gameManager: GameManager

    private forgeSpawnPosition: {x: number, y: number}
    private merchantSpawnPosition: {x: number, y: number}
    private fountainSpawnPosition: {x: number, y: number}
    
    private forgeSpawned = false
    private merchantSpawned = false
    private fountainSpawned = false

    private hasForge = false
    private hasMerchant = false
    private hasFountain = false

    constructor(gameManager: GameManager, config?: ISafeWaveConfig){
        super(()=>{})
        this.gameManager = gameManager
        this.waveDurationSeconds = config?.waveDuration ?? this.waveDurationSeconds
        if(this.waveDurationSeconds <= 0) this.waveDurationSeconds = 15
        this.forgeSpawnPosition = config?.forgeSpawnPosition ?? {x: 0, y: 0}
        this.merchantSpawnPosition = config?.merchantSpawnPosition ?? {x: this.forgeSpawnPosition.x + 100, y: this.forgeSpawnPosition.y}
        this.fountainSpawnPosition = config?.fountainSpawnPosition ?? {x: this.forgeSpawnPosition.x + 200, y: this.forgeSpawnPosition.y}
        this.hasForge = config?.hasForge ?? true
        this.hasMerchant = config?.hasMerchant ?? Math.random() < 0.3
        this.hasFountain = config?.hasFountain ?? true
    }

    public update(deltaT: number): boolean {
        if(!this.waveStarted){
            this.onWaveStart()
            this.waveStarted = true
        }

        this.timeSoFar += deltaT
        if(this.timeSoFar >= this.waveDurationSeconds){
            this.onWaveEnd()
            return true
        }

        let dungeon = this.gameManager.getDungeonManager().getDungeon()
        if(dungeon) dungeon.safeWaveTime = this.waveDurationSeconds - this.timeSoFar

        return false
    }

    /**
     * This method is called once when the wave is updated for the first time.
     */
    public onWaveStart(){
        let dungeon = this.gameManager.getDungeonManager().getDungeon()
        if(dungeon) dungeon.safeWaveTime = this.waveDurationSeconds
        if(this.hasForge){
            this.forgeSpawned = true
            this.gameManager.getForgeManager().spawnForge(this.forgeSpawnPosition)
        }
        if(this.hasMerchant) {
            this.merchantSpawned = true
            this.gameManager.getMerchantManager().spawnMerchant(this.merchantSpawnPosition)
        }
        if(this.hasFountain) {
            this.fountainSpawned = true
            this.gameManager.getFountainManager().spawnFountain(this.fountainSpawnPosition)
        }
    }

    /**
     * This method is called when the wave ends just before the wave update returns true
     */
    public onWaveEnd(){
        let dungeon = this.gameManager.getDungeonManager().getDungeon()
        if(dungeon) dungeon.safeWaveTime = 0

        if(this.forgeSpawned) this.gameManager.getForgeManager().hideForge()
        if(this.merchantSpawned) this.gameManager.getMerchantManager().hideMerchant()
        if(this.fountainSpawned) this.gameManager.getFountainManager().hideFountain()
    }
}
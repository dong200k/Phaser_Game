import GameManager from "../../../system/GameManager";
import Wave from "./Wave";

export interface ISafeWaveConfig {
    forgeSpawnPosition?: {x: number, y: number},
    merchantSpawnPosition?: {x: number, y: number},
    fountainSpawnPosition?: {x: number, y: number},
    /** Duration in seconds of the safewave */
    waveDuration?: number
}

export default class SafeWave extends Wave{
    private timeSoFar = 0
    private waveDurationSeconds = 30
    private waveStarted = false
    private gameManager: GameManager

    private forgeSpawnPosition: {x: number, y: number}
    private merchantSpawnPosition: {x: number, y: number}
    private fountainSpawnPosition: {x: number, y: number}
    
    constructor(gameManager: GameManager, config?: ISafeWaveConfig){
        super(()=>{})
        this.gameManager = gameManager
        this.waveDurationSeconds = config?.waveDuration ?? this.waveDurationSeconds
        this.forgeSpawnPosition = config?.forgeSpawnPosition ?? {x: 0, y: 0}
        this.merchantSpawnPosition = config?.merchantSpawnPosition ?? {x: this.forgeSpawnPosition.x + 100, y: this.forgeSpawnPosition.y}
        this.fountainSpawnPosition = config?.fountainSpawnPosition ?? {x: this.forgeSpawnPosition.x + 200, y: this.forgeSpawnPosition.y}
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

        this.gameManager.getForgeManager().spawnForge(this.forgeSpawnPosition)
        this.gameManager.getMerchantManager().spawnMerchant(this.merchantSpawnPosition)
        this.gameManager.getFountainManager().spawnFountain(this.fountainSpawnPosition)
    }

    /**
     * This method is called when the wave ends just before the wave update returns true
     */
    public onWaveEnd(){
        let dungeon = this.gameManager.getDungeonManager().getDungeon()
        if(dungeon) dungeon.safeWaveTime = 0

        this.gameManager.getForgeManager().hideForge()
        this.gameManager.getMerchantManager().hideMerchant()
        this.gameManager.getFountainManager().hideFountain()
    }
}
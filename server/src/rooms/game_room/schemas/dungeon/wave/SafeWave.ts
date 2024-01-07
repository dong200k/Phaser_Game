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
    /** If this is true the forge, merchant, and fountain will spawn near player instead of near the player spawn point */
    spawnNearPlayer?: boolean
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
    private spawnNearPlayer = false

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
        this.spawnNearPlayer = config?.spawnNearPlayer ?? false
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

    public getForgePosition(){
        if(this.spawnNearPlayer) {
            let player = this.gameManager.getPlayerManager().getNearestAlivePlayer(this.forgeSpawnPosition.x, this.forgeSpawnPosition.y)
            if(player) {
                let playerPos = player.getBody().position
                return {x: playerPos.x, y: playerPos.y + 150}
            }
        }
        return this.forgeSpawnPosition
    }

    public getFountainPosition(){
        let forgePosition = this.getForgePosition()
        return {x: forgePosition.x + 200, y: forgePosition.y}
    }

    public getMerchantPosition(){
        let forgePosition = this.getForgePosition()
        return {x: forgePosition.x + 100, y: forgePosition.y}
    }

    /**
     * This method is called once when the wave is updated for the first time.
     */
    public onWaveStart(){
        let dungeon = this.gameManager.getDungeonManager().getDungeon()
        if(dungeon) dungeon.safeWaveTime = this.waveDurationSeconds
        if(this.hasForge){
            this.forgeSpawned = true
            this.gameManager.getForgeManager().spawnForge(this.getForgePosition())
        }
        if(this.hasMerchant) {
            this.merchantSpawned = true
            this.gameManager.getMerchantManager().spawnMerchant(this.getMerchantPosition())
        }
        if(this.hasFountain) {
            this.fountainSpawned = true
            this.gameManager.getFountainManager().spawnFountain(this.getFountainPosition())
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
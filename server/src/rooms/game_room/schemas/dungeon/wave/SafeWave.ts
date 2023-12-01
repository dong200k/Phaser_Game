import GameManager from "../../../system/GameManager";
import Wave from "./Wave";

export default class SafeWave extends Wave{
    private timeSoFar = 0
    private waveDurationSeconds = 30
    private waveStarted = false
    private gameManager: GameManager

    private forgeSpawnPosition: {x: number, y: number}
    
    constructor(gameManager: GameManager, waveDurationSeconds: number, forgeSpawnPosition = {x: 0, y: 0}){
        super(()=>{})
        this.gameManager = gameManager
        this.waveDurationSeconds = waveDurationSeconds
        this.forgeSpawnPosition = forgeSpawnPosition
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

        return false
    }

    /**
     * This method is called once when the wave is updated for the first time.
     */
    public onWaveStart(){
        this.gameManager.getForgeManager().spawnForge(this.forgeSpawnPosition)
    }

    /**
     * This method is called when the wave ends just before the wave update returns true
     */
    public onWaveEnd(){
        this.gameManager.getForgeManager().despawnForge()
    }
}
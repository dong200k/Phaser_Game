import GameManager from "../../../system/GameManager";
import Monster from "../../gameobjs/monsters/Monster";
import Wave from "./Wave";

export interface ISafeWaveConfig {
    /** Duration in seconds of the safewave */
    waveDuration?: number,
}

export default class TimedWave extends Wave{
    private timeSoFar = 0
    private waveDurationSeconds = 30
    private waveStarted = false
    private gameManager: GameManager

    constructor(spawnMonsterCallback: (monsterId: string) => void, gameManager: GameManager, config?: ISafeWaveConfig){
        super(spawnMonsterCallback)
        this.gameManager = gameManager
        this.waveDurationSeconds = config?.waveDuration ?? this.waveDurationSeconds
        if(this.waveDurationSeconds <= 0) this.waveDurationSeconds = 30
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

        return super.update(deltaT)
    }

    /**
     * This method is called once when the wave is updated for the first time.
     */
    public onWaveStart(){
        let dungeon = this.gameManager.getDungeonManager().getDungeon()
        if(dungeon) dungeon.safeWaveTime = this.waveDurationSeconds
    }

    /**
     * This method is called when the wave ends just before the wave update returns true
     */
    public onWaveEnd(){
        // remove all monsters
        this.gameManager.gameObjects.forEach(obj=>{
            if(obj instanceof Monster) {
                obj.setActive(false)
                obj.controller.changeState('Idle')
            }
        })

        let dungeon = this.gameManager.getDungeonManager().getDungeon()
        if(dungeon) dungeon.safeWaveTime = 0
    }
}
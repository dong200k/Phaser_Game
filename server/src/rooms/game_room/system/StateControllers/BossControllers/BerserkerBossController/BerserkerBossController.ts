import Entity from "../../../../schemas/gameobjs/Entity";
import Stat from "../../../../schemas/gameobjs/Stat";
import Monster from "../../../../schemas/gameobjs/monsters/Monster";
import Projectile from "../../../../schemas/projectiles/Projectile";
import MonsterController, { MonsterControllerData } from "../../../AI/MonsterAI/simplemonster/MonsterController";
import { CategoryType } from "../../../Collisions/Category";
import BerserkerAbilityLogic from "../../../EffectLogic/EffectLogics/abilities/BerserkerAbility/BerserkerAbility";
import GameManager from "../../../GameManager";
import StateMachine from "../../../StateMachine/StateMachine"
import { GameEvents, IProjectileConfig } from "../../../interfaces";
import { difficultyMap } from "./DifficultyMap";
import Attack, { AttackConfig } from "./states/Attack";
import Dead from "./states/Dead";
import FinalAttack from "./states/FinalAttack";
import Follow from "./states/Follow";
import FollowingGetsuga from "./states/FollowingGetsuga";
import GetsugaSlash from "./states/GetsugaSlash";
import Idle from "./states/Idle";
import Roll from "./states/Roll";
import SpinningGetsuga from "./states/SpinningGetsugas";
import TornadoSpin from "./states/TornadoSpin";
import Transformation from "./states/Transformation";
export interface BossControllerData {
    monster: Monster;
}

type DifficultyMode = "Easy" | "Medium" | "Hard"

interface IStateCycle{
    stateName: stateNames,
    time: number,
    config?: any
}

interface IStateMap{
    "GetsugaSlash"?: GetsugaSlash,
    "Attack"?: Attack,
    "TornadoSpin"?: TornadoSpin,
    "Idle"?: Idle,
    "FinalAttack"?: FinalAttack,
    "FollowingGetsuga"?: FollowingGetsuga,
    "SpinningGetsuga"?: SpinningGetsuga
}

type stateNames = keyof IStateMap

export default class BerserkerBossController extends MonsterController{
    private boss!: Monster
    private gameManager!: GameManager
    private target?: Entity
    private ability?: BerserkerAbilityLogic
    /** Collision type of projectiles */
    private categoryType: CategoryType = "DAMAGE_ALL_PROJECTILE"

    public stateMap: IStateMap = {}
    
    public transformed = false
    private timeSoFar = 0
    /** State to change to after a certain amount of time. Loops */
    private stateCycle: IStateCycle[] = []

    private currentCycle = 0

    /** Duration boss is aggroed for before it can start changing targets if boss is aggroed by the aggroBoss method. */
    private aggroDuration = 10
    private aggroTimeSoFar = 0
    private isAggroed = false

    private difficultyMode: DifficultyMode = "Medium"

    protected create(data: BossControllerData): void {
        this.boss = data.monster
        this.gameManager = this.boss.gameManager
        
        this.stateMap["Attack"] = new Attack("Attack", this)
        this.addState(this.stateMap["Attack"])

        this.addState(new Follow("Follow", this))

        this.addState(new Idle("Idle", this))

        this.stateMap["GetsugaSlash"] = new GetsugaSlash("GetsugaSlash", this)
        this.addState(this.stateMap["GetsugaSlash"])

        this.addState(new Roll("Roll", this))

        this.stateMap["TornadoSpin"] = new TornadoSpin("TornadoSpin", this)
        this.addState(this.stateMap["TornadoSpin"])

        this.stateMap["FinalAttack"] = new FinalAttack("FinalAttack", this)
        this.addState(this.stateMap["FinalAttack"])

        this.stateMap["FollowingGetsuga"] = new FollowingGetsuga("FollowingGetsuga", this)
        this.addState(this.stateMap["FollowingGetsuga"])

        this.stateMap["SpinningGetsuga"] = new SpinningGetsuga("SpinningGetsuga", this)
        this.addState(this.stateMap["SpinningGetsuga"])

        this.addState(new Transformation("Transformation", this))
        this.addState(new Dead("Dead", this))

        this.changeState("Idle")
        this.initStateCycles()
        this.boss.sound.playBackgroundMusic("boss_getting_dark")
    }

    public update(deltaT: number): void {
        super.update(deltaT)

        if(this.currentCycle >= this.stateCycle.length) this.currentCycle = 0

        let cycleState = this.stateCycle[this.currentCycle]

        if(cycleState.stateName !== this.stateName){
            this.timeSoFar += deltaT
        }        

        let prevStateName = this.currentCycle === 0? this.stateCycle[this.stateCycle.length - 1].stateName : this.stateCycle[this.currentCycle - 1].stateName

        // Player is not dead the time passed to enter next state and the previous state is completed.
        if(this.timeSoFar >= cycleState.time && this.stateName !== "Dead" && this.stateName !== prevStateName){
            this.timeSoFar = 0
            this.stateMap[cycleState.stateName]?.setConfig(cycleState.config)
            this.changeState(this.stateCycle[this.currentCycle].stateName)
            this.currentCycle += 1
        }
        
        if(this.boss.stat.hp <= 0){
            if(this.transformed && this.stateName !== "Dead") {
                this.changeState("Dead")
            } 
            else if(this.stateName !== "Transformation" && !this.transformed) {
                this.changeState("Transformation")
            }
        }

        if(this.isAggroed){
            this.aggroTimeSoFar += deltaT
            if(this.aggroTimeSoFar >= this.aggroDuration){
                this.aggroTimeSoFar = 0
                this.isAggroed = false
            } 
        }
    }

    public postUpdate(deltaT: number): void {
    }

    private setDifficulty(mode: DifficultyMode){
        this.difficultyMode = mode
    }

    getBoss(){
        return this.boss
    }

    getGameManager(){
        return this.gameManager
    }

    /** Returns target if they are alive */
    getTarget(){
        if(this.target && this.target?.stat.hp <= 0) return undefined
        return this.target
    }

    setTarget(entity: Entity | undefined){
        this.target = entity
    }

    spawnProjectile(projectileConfig: IProjectileConfig){
        // this.gameManager.getEventEmitter().emit(GameEvents.SPAWN_PROJECTILE, projectileConfig);        // this.gameManager.getEventEmitter().emit(GameEvents.SPAWN_PROJECTILE, projectileConfig);
        this.gameManager.getEventEmitter().emit(GameEvents.SPAWN_PROJECTILE, {
            ...projectileConfig,
            // initialVelocity: {x: 0, y:0}
        });
    }

    initStateCycles(){
        // this.stateCycle = [
        //     {stateName: "GetsugaSlash", time: 7, config: {slashCount: 5, timeBetweenSlashes: 0, getsugaCount: 1}},
        //     {stateName: "SpinningGetsuga", time: 3, config: {slashCount: 4, timeBetweenSlashes: 0.5, radius: 200, projectileActiveTime: 15000}},
        //     {stateName: "TornadoSpin", time: 3, config: {getsugaCount: 2, timeBetweenSlashes: 1, attackDuration: 5}},
        //     {stateName: "Idle", time: 0},
        //     {stateName: "GetsugaSlash", time: 7, config: {slashCount: 3, timeBetweenslashes: 0.5, getsugaCount: 3}},
        //     {stateName: "FinalAttack", time: 5, config: {getsugaCount: 25, attackDuration: 4, projectileSpeed: 10}},
        //     {stateName: "FollowingGetsuga", time: 2, config: {slashCount: 5, timeBetweenSlashes: 1, getsugaCount: 1, maxProjectileSpeed: 7, minProjectileSpeed: 3, projectileActiveTime: 10000}},
        //     {stateName: "Idle", time: 0},
        //     {stateName: "GetsugaSlash", time: 7, config: {slashCount: 2, timeBetweenslashes: 0.5, getsugaCount: 5}},
        //     {stateName: "SpinningGetsuga", time: 3, config: {slashCount: 4, timeBetweenSlashes: 0.5, radius: 200, projectileActiveTime: 15000}},
        //     {stateName: "TornadoSpin", time: 3, config: {getsugaCount: 2, timeBetweenSlashes: 1.5, attackDuration: 5}},
        //     {stateName: "FinalAttack", time: 5, config: {getsugaCount: 25, attackDuration: 4, projectileSpeed: 10}},
        //     {stateName: "Idle", time: 0},
        // ]
        this.initCycles()
    }



    /**
     * Initializes states for pre transformation state.
     */
    private initCycles(){
        let stateNames: stateNames[] = [
            "GetsugaSlash", "SpinningGetsuga", "TornadoSpin", "Idle", 
            "GetsugaSlash", "FinalAttack", "FollowingGetsuga", "Idle",
            "GetsugaSlash", "SpinningGetsuga", "TornadoSpin", "FinalAttack", "Idle"
        ]

        this.stateCycle = this.getStateCyclesFromStateNames(stateNames)
    }

    private getStateCyclesFromStateNames(stateNames: stateNames[]){
        let stateCycles: IStateCycle[] = []
        stateNames.forEach(stateName=>{
            if(stateName === "Idle") stateCycles.push({stateName, time: 0})
            else stateCycles.push(this.getStateCycle(stateName))
        })
        return stateCycles
    }

    /**
     * Initializes states for post transformation state
     */
    private initTransformCycles() {
        let stateNames: stateNames[] = [
            "FinalAttack", "FollowingGetsuga", "Idle",
            "GetsugaSlash", "SpinningGetsuga", "TornadoSpin", "Idle",
            "GetsugaSlash", "FinalAttack", "FollowingGetsuga", "TornadoSpin", "Idle",
            "GetsugaSlash", "SpinningGetsuga", "TornadoSpin", "Idle"
        ]

        this.stateCycle = this.getStateCyclesFromStateNames(stateNames)
    }


    /** Generates a random state cycle based on stateName and the data inside the difficulty map and the current difficulty mode. */
    private getStateCycle(stateName: stateNames){
        let multiplier = 1
        if(this.transformed) multiplier = 1.5

        const getRandomBetween = ({max, min}: {max: number, min: number})=>{
            return Math.random() * (max - min) + min
        }

        let difficultyData
        switch(this.difficultyMode){
            case "Easy":
                difficultyData = difficultyMap.Easy
                break;
            case "Medium":
                difficultyData = difficultyMap.Medium
                break;
            case "Hard":
                difficultyData = difficultyMap.Hard
                break;
            default:
                difficultyData = difficultyMap.Easy
        }

        // Init config data
        let config: any = {}
        let configHelperData = difficultyData[stateName]
        if("slashCountRange" in configHelperData) config["slashCount"] = getRandomBetween(configHelperData.slashCountRange) * multiplier
        if("getsugaCountRange" in configHelperData) config["getsugaCount"] = getRandomBetween(configHelperData.getsugaCountRange) * multiplier
        if("attackDurationRange" in configHelperData) config["attackDuration"] = getRandomBetween(configHelperData.attackDurationRange) * multiplier
        if("projectileActiveTime" in configHelperData) config["projectileActiveTime"] = configHelperData.projectileActiveTime * multiplier
        if("radius" in configHelperData) config["radius"] = configHelperData.radius
        if("timeBetweenSlashes" in configHelperData) config["timeBetweenSlashes"] = configHelperData.timeBetweenSlashes / multiplier
        if("projectileSpeedRange" in configHelperData) {
            if(stateName === "SpinningGetsuga"){
                config["projectileSpeed"] = getRandomBetween(configHelperData.projectileSpeedRange) * multiplier
            }else if(stateName === "FollowingGetsuga"){
                config["maxProjectileSpeed"] = configHelperData.projectileSpeedRange.max * multiplier
                config["minProjectileSpeed"] = configHelperData.projectileSpeedRange.min * multiplier
            }
        }

        // Create state cycle
        let timeRange = difficultyData.timeRange
        let stateCycle: IStateCycle = {
            stateName,
            time: Math.random() * (timeRange.max - timeRange.min) + timeRange.min + 1,
            config
        }
        return stateCycle
    }

    /** Activates the flame aura ability and modifies the bosses attack patterns and stats */
    transform(){
        this.transformed = true
        this.currentCycle = 0

        // Activate ability
        let temp = this.gameManager.getEffectLogicManager().getEffectLogicCtorAndConfig("berserker-ability")
        if(temp) {
            let {ctor} = temp
            this.ability = new ctor() as BerserkerAbilityLogic
            this.ability.setConfig({
                categoryType: this.categoryType,
                maxBoostPercent: 0.3,
                maxBoost: 1,
                minBoost: 0.1,
                flameAuraDamageMultiplier: 0.1,
                soundKey: "ultra_instinct_boss",
                statToBuff: {
                    speed: true,
                    attackSpeed: true,
                    attack: true,
                    armor: true,
                    chargeAttackSpeed: false,
                }
            })
            this.ability.useEffect(this.boss, this.gameManager)
        }

        // Modify stats
        this.boss.stat.armorPen = 0.7
        this.boss.stat.maxHp *= 2
        this.boss.stat.hp = this.boss.stat.maxHp

        // Change attack patterns
        this.initTransformCycles()
        // this.stateCycle = [ 
        //     {stateName: "FinalAttack", time: 10, config: {getsugaCount: 100, attackDuration: 5, projectileSpeed: 10}},
        //     {stateName: "FollowingGetsuga", time: 7, config: {slashCount: 8, timeBetweenSlashes: 1, getsugaCount: 1, maxProjectileSpeed: 10, minProjectileSpeed: 3, projectileActiveTime: 10000}},
        //     {stateName: "Idle", time: 0},
        //     {stateName: "GetsugaSlash", time: 7, config: {slashCount: 2, timeBetweenslashes: 0, getsugaCount: 10, categoryType: this.categoryType}},
        //     {stateName: "Idle", time: 0},
        //     {stateName: "SpinningGetsuga", time: 3, config: {slashCount: 5, timeBetweenSlashes: 0.5, projectileActiveTime: 15000, radius: 250}},
        //     {stateName: "TornadoSpin", time: 7, config: {getsugaCount: 4, categoryType: this.categoryType, timeBetweenSlashes: 1, attackDuration: 3, speedBoostMult: 0.8, speedBoostDuration: 3}},
        //     {stateName: "Idle", time: 0},
        //     {stateName: "GetsugaSlash", time: 7, config: {slashCount: 3, timeBetweenSlashes: 0, getsugaCount: 5, categoryType: this.categoryType}},
        //     {stateName: "FinalAttack", time: 5, config: {getsugaCount: 100, attackDuration: 10, projectileSpeed: 10}},
        //     {stateName: "FollowingGetsuga", time: 7, config: {slashCount: 8, timeBetweenSlashes: 1, getsugaCount: 1, maxProjectileSpeed: 10, minProjectileSpeed: 3, projectileActiveTime: 10000}},
        //     {stateName: "TornadoSpin", time: 10, config: {getsugaCount: 4, categoryType: this.categoryType, timeBetweenSlashes: 1, attackDuration: 3, speedBoostMult: 0.8, speedBoostDuration: 3}},
        //     {stateName: "Idle", time: 0},
        //     {stateName: "GetsugaSlash", time: 7, config: {slashCount: 3, getsugaCount: 7, categoryType: this.categoryType}},
        //     {stateName: "Idle", time: 0},
        //     {stateName: "SpinningGetsuga", time: 3, config: {slashCount: 5, timeBetweenSlashes: 0.5, projectileActiveTime: 15000, radius: 250}},
        //     {stateName: "TornadoSpin", time: 10, config: {getsugaCount: 4, categoryType: this.categoryType, timeBetweenSlashes: 1, attackDuration: 3, speedBoostMult: 0.8, speedBoostDuration: 3}},
        // ]

    }

    turnOffAbility(){
        this.ability?.useEffect(this.boss, this.gameManager)
    }

    public seekTarget(){
        // Seek next target if boss is not aggroed or if aggro target has no health
        if(!this.isAggroed || (this.isAggroed && this.target && this.target?.stat.hp <= 0)){
            let bossPos = this.boss.getBody().position
            let target = this.gameManager.getPlayerManager().getNearestAlivePlayer(bossPos.x, bossPos.y)
            this.setTarget(target)
            console.log(`Berserker boss locked onto target`, target?.name)
        }
        if(this.target) this.changeState("Follow")
    }

    /**
     * Call this target to change boss attention to an entity for aggroDuration.
     * @param entity to target
     * @param aggroDuration til boss can freely target other entities. Default duration is 10 seconds.
     */
    public aggroBoss(entity: Entity, aggroDuration: number = 10){
        this.setTarget(entity)
        this.isAggroed = true
        this.aggroTimeSoFar = 0
    }

    public getGetsugaExplosionCallback(){
        return (projectile: Projectile)=>{
            let {x: spawnX, y: spawnY} = projectile.getBody().position
            // console.log("spawning explosion projectile", spawnX, spawnY)
            // console.log("boss x,y", this.boss.getBody().position.x, this.boss.getBody().position.y)

            let projectileConfig: IProjectileConfig = {
                sprite: "GetsugaTenshou",
                stat: new Stat(),
                spawnX,
                spawnY,
                width: 50,
                height: 50,
                initialVelocity: {x: 0, y: 0},
                collisionCategory: "NONE",
                poolType: "Getsuga Tenshou Explosion",
                attackMultiplier: 0,
                magicMultiplier: 0,
                activeTime: 1000,
                animationKey: "explode",
                repeatAnimation: false,
                classType: "Projectile"
            }
    
            this.spawnProjectile(projectileConfig)
        }
    }
}
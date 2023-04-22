import Matter from "matter-js";
import MathUtil from "../../../../../util/MathUtil";
import GameManager from "../../../system/GameManager";
import State from "../../State";
import Player from "../../gameobjs/Player";
import Effect from "../Effect";
import EffectFactory from "../EffectFactory";
import OneTimeEffect from "../onetime/OneTimeEffect";
import Entity from "../../gameobjs/Entity";

/**
 * To run test first cd in to server directory 
 * Run with ts-node using: npx ts-node src/rooms/game_room/schemas/effects/tests/EffectTest.ts
 */ 

console.log("------ Starting tests for the Effect class ------");
let state = new State();
let gameManager = new GameManager(state);

// ---- Game Loop ----
let prevTime = Date.now();
let intervalID = setInterval(() => {
    let currentTime = Date.now();
    gameManager.update((currentTime - prevTime) / 1000);
    prevTime = currentTime;
}, 33);


// ---- Print helper which calls printCallback every second ----
let secondsPassed = 0;
let printCallback = () => {};
let printInterval = setInterval(() => {
    secondsPassed += 1;
    console.log(`--- after ${secondsPassed}s ---`);
    printCallback();
}, 1000);

// ------ Ends the test after a certain period of time -----
let testTimeSeconds = 10;
setTimeout(() => {
    console.log("---Test Ended---");
    clearInterval(intervalID);
    clearInterval(printInterval);
}, testTimeSeconds * 1000);

// ---- Helper for printing the effects of an entity ----
const printEffects = (entity: Entity) => {
    entity.effects.forEach((effect) => {
        console.log(`\t${effect.toString()}`);
    })
    if(entity.effects.length === 0) {
        console.log("\tThere are no more Effect");
    }
}

function testingOneTimeEffect() {
    console.log("------Testing one time effect-----")
    let player1 = new Player("Bob", "warrior");
    gameManager.addGameObject(MathUtil.uid(), player1, Matter.Bodies.rectangle(0, 0, 0, 0));
    console.log(`Player 1's starting hp: ${player1.stat.hp}`);
    //Add healing effect to player 1.
    player1.effects.push(EffectFactory.createHealEffect(10));
    player1.effects.push(EffectFactory.createHealEffect(20));
    player1.effects.push(EffectFactory.createHealEffect(40));
    player1.effects.push(EffectFactory.createDamageEffect(160));

    printCallback = () => {
        console.log(`Player 1's new hp: ${player1.stat.hp}`);
        console.log(`player1's effects: `);
        printEffects(player1);
    };

    console.log("----- at 0s -----");
    printCallback();
}

function testingContinuousEffect() {
    console.log("------Testing continuous effect-----")
    let player1 = new Player("Bob", "warrior");
    gameManager.addGameObject(MathUtil.uid(), player1, Matter.Bodies.rectangle(0, 0, 0, 0));
    console.log(`Player 1's starting hp: ${player1.stat.hp}`);
    
    //Add effects
    player1.effects.push(EffectFactory.createRegenEffect(200, 5, 1));
    //player1.effects.push(EffectFactory.createDamageOverTimeEffect(200, 5, 1));

    console.log(`player1's effects:`);
    printEffects(player1);

    printCallback = () => {
        console.log(`Player 1's new hp: ${player1.stat.hp}`);
        console.log(`player1's effects: `);
        printEffects(player1);
    };

    console.log("----- at 0s -----");
    printCallback();
}

function testingChainEffect() {
    console.log("------Testing chain effect-----")
    let player1 = new Player("Bob", "warrior");
    gameManager.addGameObject(MathUtil.uid(), player1, Matter.Bodies.rectangle(0, 0, 0, 0));
    console.log(`Player 1's starting hp: ${player1.stat.hp}`);
    
    //Add effects
    player1.effects.push(EffectFactory.createChainEffect([
        EffectFactory.createRegenEffect(100, 0.6, 0.3),
        EffectFactory.createRegenEffect(100, 0.6, 0.3),
        EffectFactory.createRegenEffect(100, 0.6, 0.3),
        EffectFactory.createRegenEffect(100, 0.6, 0.3),
        EffectFactory.createRegenEffect(100, 0.6, 0.3),
        EffectFactory.createRegenEffect(100, 0.6, 0.3),
        EffectFactory.createRegenEffect(100, 0.6, 0.3),
        EffectFactory.createRegenEffect(100, 0.6, 0.3),
        EffectFactory.createRegenEffect(100, 0.6, 0.3),
        EffectFactory.createRegenEffect(100, 0.6, 0.3),
    ]));

    console.log(`player1's effects:`);
    printEffects(player1);

    printCallback = () => {
        console.log(`Player 1's new hp: ${player1.stat.hp}`);
        console.log(`player1's effects: `);
        printEffects(player1);
    };

    console.log("----- at 0s -----");
    printCallback();
}


// testingOneTimeEffect();
// testingContinuousEffect();
testingChainEffect();



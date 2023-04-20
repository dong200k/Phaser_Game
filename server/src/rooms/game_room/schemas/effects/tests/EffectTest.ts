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
let intervalID = setInterval(() => gameManager.update(33), 33);

const printEffects = (entity: Entity) => {
    entity.effects.forEach((effect) => {
        console.log(`\t${effect.toString()}`);
    })
    if(entity.effects.length === 0) {
        console.log("\tThere are no more Effect");
    }
}

function testingOneTimeEffect() {
    let player1 = new Player("Bob", "warrior");
    gameManager.addGameObject(MathUtil.uid(), player1, Matter.Bodies.rectangle(0, 0, 0, 0));
    console.log(`Player 1's starting hp: ${player1.stat.hp}`);
    //Add healing effect to player 1.
    player1.effects.push(EffectFactory.createHealEffect(10));
    player1.effects.push(EffectFactory.createHealEffect(20));
    player1.effects.push(EffectFactory.createHealEffect(40));
    player1.effects.push(EffectFactory.createDamageEffect(160));

    console.log(`player1's effects:`);
    printEffects(player1);

    setTimeout(() => {
        console.log("--- after 100ms ---");
        console.log(`Player 1's new hp: ${player1.stat.hp}`);
        console.log(`player1's effects: `);
        printEffects(player1);
    }, 100)
}

testingOneTimeEffect();

setTimeout(() => {
    console.log("Test Ended");
    clearInterval(intervalID);
}, 10000);

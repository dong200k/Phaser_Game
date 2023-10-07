import EffectFactory from "../../../../../schemas/effects/EffectFactory";
import StatEffect, { StatConfig } from "../../../../../schemas/effects/temp/StatEffect";
import Entity from "../../../../../schemas/gameobjs/Entity";
import Player from "../../../../../schemas/gameobjs/Player";
import Aura from "../../../../../schemas/gameobjs/aura/Aura";
import GameManager from "../../../../GameManager";
import StateMachine from "../../../../StateMachine/StateMachine";
import StateNode from "../../../../StateMachine/StateNode";
import EffectManager from "../../../../StateManagers/EffectManager";
import StatAuraController from "../StatAuraController";

interface IActiveConfig {
    statConfig?: StatConfig;
}

interface EntityData {
    statEffectId: string;
    entity: Entity;
}

export default class Active extends StateNode {

    private entityData: EntityData[] = [];

    public onEnter(): void {
        this.entityData = [];
    }

    public onExit(): void {
        for(let i = this.entityData.length - 1; i >= 0; i--) {
            this.onExitAura(this.entityData[i].entity);
        }
        this.entityData = [];
    }

    public update(deltaT: number): void {
        
    }

    /**
     * When the entity enters this aura, adds the statEffect to the entity.
     * The statEffect should have been added when this class(Active) was constructed.
     * @param entity The entity.
     */
    public onEnterAura(entity: Entity): void {
        let statConfig = this.getStateMachine<StatAuraController>().getStatConfig();
        let statEffectId = EffectManager.addStatEffectsTo(entity, 
            EffectFactory.createStatEffect(statConfig));
        this.entityData.push({
            entity: entity,
            statEffectId: statEffectId,
        })
    }

    /**
     * When the entity exits this aura, remove the statEffect from the entity.
     * @param entity The entity.
     */
    public onExitAura(entity: Entity): void {
        for(let i = this.entityData.length - 1; i >= 0; i--) {
            let currentEntity = this.entityData[i].entity;
            if(currentEntity === entity) {
                EffectManager.removeStatEffectFrom(currentEntity, this.entityData[i].statEffectId);
                this.entityData.splice(i, 1);
            }
        }
    }
}


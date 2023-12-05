import SkillData from "../../schemas/Trees/Node/Data/SkillData";
import WeaponData from "../../schemas/Trees/Node/Data/WeaponData";
import Node from "../../schemas/Trees/Node/Node";
import StatTree from "../../schemas/Trees/StatTree";
import WeaponUpgradeTree from "../../schemas/Trees/WeaponUpgradeTree";
import EffectFactory from "../../schemas/effects/EffectFactory";
import OneTimeUpgradeEffect from "../../schemas/effects/onetime/OneTimeUpgradeEffect";
import Player from "../../schemas/gameobjs/Player";
import Stat from "../../schemas/gameobjs/Stat";
import UpgradeEffect from "../../schemas/gameobjs/UpgradeEffect";
import EffectManager from "./EffectManager";

export default class TreeManager{

    static selectGivenUpgrade<T extends WeaponUpgradeTree|StatTree<SkillData>, U extends Exclude<T["root"], undefined>>
    (playerState: Player, tree: T, upgrade: U){
        this.selectUpgrade(playerState, tree, [upgrade], 0)
    }

    /**
     * Selects and activates the upgrade of a player's tree (skill or weapon/artifact) based on player's choice.  This will automatically add the tree's selected node's effects to the player.
     * Note: WeaponUpgradeTree covers artifact and weapon tree while StatTree<SkillData> covers the skill tree. The type of a upgrade is deterimined by whether we use WeaponUpgradeTree or StatTree<SkillData>.
     * @param playerState player who is selecting the upgrade
     * @param tree upgrade tree (Weapon or Artifact or Skill) that upgrade is being selected for. WeaponUpgradeTree is used for both aritfact and weapon upgrade
     * @param upgrades list of available upgrades to choose from.
     * @param choice choice of upgrade, zero indexed non negative integer
     */
    static selectUpgrade<T extends WeaponUpgradeTree|StatTree<SkillData>, U extends Exclude<T["root"], undefined>>
    (playerState: Player, tree: T, upgrades: U[], choice: number){
        // Choice out of bounds
        if(choice >= upgrades.length) return

        // Mark upgrade as selected
        let selectedUpgrade = upgrades[choice]

        selectedUpgrade.data.setStatus("selected")
        
        // Special Logic for selecting Weapon/Artifact Upgrade Tree node
        if(selectedUpgrade.data instanceof WeaponData){
            // *** Note: uncomment this if upgrade on the same level as the selected upgrade should be skipped ***
            // Mark nodes on same depth as selected
            // if(upgrades.length > 1)
            // upgrades.forEach((upgrade, i)=>{
            //     if(i!==choice) upgrade.data.setStatus("skipped")
            // })

            // Change base weapon which provides sprites if node has a weaponId
            let data = selectedUpgrade.data as WeaponData
            let weaponId = data.weaponId
            if(weaponId) TreeManager.setTreeWeapon(tree as WeaponUpgradeTree, weaponId)
 
            // If node has an UpgradeEffect then convert it to an Effect and apply it to the player
            if(selectedUpgrade.data.upgradeEffect){
                let effect = EffectFactory.createEffectFromUpgradeEffect(selectedUpgrade.data.upgradeEffect)
                effect.setTree(tree as WeaponUpgradeTree)
                // effect.setGameManager(this.gameManager)

                // Add effect to player
                EffectManager.addUpgradeEffectsTo(playerState, effect)
                
                if(tree instanceof WeaponUpgradeTree){
                    // Store the effect so it can be removed when the tree is unequipped
                    tree.effects.push(effect)
                }
            }
        }

        // Add selected upgrade node's stat bonus to player
        let stat = selectedUpgrade.data.stat
        let statEffect = EffectFactory.createStatEffect(stat)
        let UUID = EffectManager.addStatEffectsTo(playerState, statEffect)
        tree.statEffectIds.push(UUID) // Store selected stat effect's key so it can be removed when the tree is unequipped
        // Change total tree stat inplace to reflect changes
        tree.totalStat.add(stat)
    }

    /**
     * Takes in a WeaponUpgradeTree (artifact/weapon upgrades) or a StatTree and returns the list of available upgrades in the tree with DFS.
     * The available upgrades are the nodes with status = "none" that are immediately connected to a node with status = "skipped" | "selected" or the root node if that has status = "none".
     * @param tree to get upgrades from
     * @returns a list of available upgrades
     */
    static getAvailableUpgrades <T extends WeaponUpgradeTree|StatTree<SkillData>, U extends Exclude<T["root"], undefined>>
    (tree: T): U[]{
        let root = tree.root
        if(!root) return []

        let upgrades: U[] = []
        //dfs traversal to get next upgrades    
        function dfs(root: U){
            if(root.data.status === "none"){
                return upgrades.push(root)
            }
            
            for(let node of root.children){
                dfs(node as U) // Node will definitely be same type as tree's root
            }
        }

        dfs(root as U) // Typescript doesn't catch it, but obviously the tree root is same type U since U extends the tree root
        return upgrades
        
    }

    /** Compute an Effect[] based on the UpgradeEffects of selected nodes on the tree and applies them to the player (applies them based on selectionIndex order aka when they were selected). 
     * Also stores these effects inside the tree so that they can be removed when the tree is unequipped
     * @param playerState player who is receiving the effects
     * @param tree tree that effects are coming from
     * @param gameManager game that the player belongs to
    */
    static addTreeUpgradeEffectsToPlayer(playerState: Player, tree: WeaponUpgradeTree){
        // Convert upgradeEffects (which are sorted in order they were selected first at the front of the list) to Effects
        // then apply them to the player from first to last
        let orderedUpgradeEffects = TreeManager.getSelectedTreeEffects(tree)
        
        let effects = orderedUpgradeEffects.map((upgradeEffect: UpgradeEffect)=>{
            let effect = EffectFactory.createEffectFromUpgradeEffect(upgradeEffect)
            effect.setTree(tree)
            // effect.setGameManager(this.gameManager)
            return effect
        })
        EffectManager.addUpgradeEffectsTo(playerState, effects)
        
        // store effects so they can be removed when the artifact is unequipped
        effects.forEach((effect)=>tree.effects.push(effect))
    }

    /**
     * Computes total stats on the tree based on nodes selected and applies them to the player. Also stores the UUID for the stat effects inside the tree so
     * they can be removed when the tree is unequipped.
     * @param playerState player who is receiving the stats
     * @param tree tree to get the stats from
     */
    static addTreeStatsToPlayer(playerState: Player, tree: WeaponUpgradeTree | StatTree<SkillData>){
        let totalStat = TreeManager.computeTotalStat(tree.root)
        let statEffect = EffectFactory.createStatEffect(totalStat)
        let UUID = EffectManager.addStatEffectsTo(playerState, statEffect)
        tree.statEffectIds.push(UUID) // Add id to artifact tree so it can be removed when tree is unequipped
        return totalStat
    }

    /**
     * Remove all upgrade effects that the input tree provides to the player
     * @param playerState player who is getting effects removed
     * @param tree tree with the effects to be removed from player
     */
    static removeTreeUpgradeEffects(playerState: Player, tree: WeaponUpgradeTree){
        tree.effects.forEach((effect)=>EffectManager.removeEffectFrom(playerState, effect))
    }

    /**
     * Removes all stats that the input tree provides to the player
     * @param playerState player who is getting the stats removed
     * @param tree tree with stats to be removed from player
     */
    static removeTreeStats(playerState: Player, tree: WeaponUpgradeTree | StatTree<SkillData>){
        tree.statEffectIds.forEach((id)=>EffectManager.removeStatEffectFrom(playerState, id))
    }

    /**
     * Sets the base weapon(determines sprite, projectile sprite etc.) for a Weapon/Artifact Upgrade Tree
     * @description Note: this should be called inside of TreeUtil.selectUpgrade()
     * @param tree tree to change weapon
     * @param weaponId id for the new base weapon to equip
     */
    static setTreeWeapon(tree: WeaponUpgradeTree, weaponId: string){
        tree.setWeapon(weaponId)
    }

    /**
     * Takes in a weapon or skill tree and gets the total stats the tree provides based on selected upgrades.
     * Warning: Do not modify the returned stat
     * @param tree
     * @returns returns a Stat class with the trees total stats, do not modify
     */
    static getTotalStat(tree: WeaponUpgradeTree | StatTree<SkillData>){
        return tree.totalStat
    }

    /**
     * Takes in the root node of a tree and computes the total stats the tree provides based on selected upgrades.
     * @param root
     * @returns 
     */
    static computeTotalStat(root?: Node<WeaponData> | Node<SkillData>){
        let totalStats = Stat.getZeroStat()
        let name = root?.data.name

        //dfs traversal to get stats that have been selected
        function dfs(root: Node<WeaponData> | Node<SkillData>){
            // if(name === "Adventurer's Stat"){
            //     console.log(root.data.name, root.data.status)
            // }
            switch(root.data.status){
                case "selected":
                    // Increase total in place
                    totalStats.add(root.data.stat)
                    break
                case "none":
                    return
            }
            
            for(let node of root.children){
                dfs(node)
            }
        }

        if(root) dfs(root)

        return totalStats
    }

    /**
     * Takes in a weapon tree and returns a list of UpgradeEffect that is selected on the tree in order of when the node was choosen. 
     * Effects that players selected first will be first in the list.
     * Note: UpgradeEffect holds database json information, it is not an intanceof Effect
     * @param tree
     * @returns UpgradeEffect[] sorted in order their nodes were selected
     */
    static getSelectedTreeEffects(tree: WeaponUpgradeTree){
        let upgradeEffectsWithOrder: Array<{effect: UpgradeEffect, order: number}> = []

        //dfs traversal to get upgradeEffects of nodes that have been selected and have upgradeEffects
        function dfs(root: Node<WeaponData>){
            switch(root.data.status){
                case "selected":
                    // Selected nodes definitely have a selectionTime
                    if(root.data.upgradeEffect && root.data.upgradeEffect.effectLogicId && root.data.upgradeEffect.effectLogicId !== ""){
                        upgradeEffectsWithOrder.push({effect: root.data.upgradeEffect, order: root.data.selectionTime as number})
                    }
                    break;
                // case "none":
                //     return
            }
            
            for(let node of root.children){
                dfs(node)
            }
        }

        if(tree.root) dfs(tree.root)

        // Sort the upgradeEffects to the ones selected first/with smaller order comes first then
        // Return the upgradeEffects only without order
        return upgradeEffectsWithOrder
            .sort((u1: {effect: UpgradeEffect, order: number}, u2: {effect: UpgradeEffect, order: number})=>{
                return u1.order - u2.order})
            .map((u: {effect: UpgradeEffect, order: number})=>u.effect)
    }

    /**
     * Takes in a WeaponUpgradeTree or a StatTree and returns the last selected weaponId
     * @param tree
     * @returns weaponId from the last selected node
     */
    static getWeaponId(tree: WeaponUpgradeTree){
        let weaponId = ""
        let maxSelectionTime = -1

        //dfs traversal
        function dfs(root: Node<WeaponData>){
            switch(root.data.status){
                case "selected":
                    // Selected nodes definitely have a selectionTime
                    if(root.data.weaponId && root.data.selectionTime && root.data.selectionTime > maxSelectionTime) {
                        weaponId = root.data.weaponId
                    }
                    break;
                // case "none":
                //     return
            }
            
            for(let node of root.children){
                dfs(node)
            }
        }

        if(tree.root) dfs(tree.root)

        return weaponId
    }
}
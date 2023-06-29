import WeaponData from "../../../schemas/Trees/Node/Data/WeaponData"
import Node from "../../../schemas/Trees/Node/Node"
import Stat from "../../../schemas/gameobjs/Stat"
import UpgradeEffect from "../../../schemas/gameobjs/UpgradeEffect"
import DatabaseManager from "../../Database/DatabaseManager"

export default class WeaponUpgradeFactory{

    /**
     * Creates a Node class from a single node from an upgrade from db formatted as a json (does not copy children)
     * @param copy single node from an upgrade in db.json formatted as json
     * @returns 
     */
    private static createNode(copy: Node<WeaponData>){
        let {weaponId, name, description, stat, upgradeEffect, status, selectionTime} = copy.data
        stat = new Stat(stat)
        if(upgradeEffect && upgradeEffect.effectLogicId !== "" && upgradeEffect.effectLogicId){
            let type = String(upgradeEffect.type)
            let effectLogicId = String(upgradeEffect.effectLogicId)
            let cooldown = Number(upgradeEffect.cooldown)
            let doesStack = Boolean(upgradeEffect.doesStack)
            let collisionGroup = Number(upgradeEffect.collisionGroup)
            upgradeEffect = new UpgradeEffect(type, effectLogicId, cooldown, doesStack, collisionGroup)
        }else{
            upgradeEffect = undefined
        }
        let weaponData = new WeaponData(weaponId, stat, upgradeEffect, name, description, status, selectionTime)
        let node = new Node<WeaponData>(weaponData)

        return node
    }

    /**
     * Creates a Node and its children with data from database upgrade
     * @param id id of upgrade from database to create Node from 
     * @returns
     */
    static createUpgrade(id: string, selectRoot: boolean = true){
        let upgrade = DatabaseManager.getManager().getUpgrade(id)
        if(!upgrade) return

        let root = WeaponUpgradeFactory.createNode(upgrade.root)
        
        // Takes in a Node class and a db.json nodeToCopy.
        // creates class Nodes from all the children of nodeToCopy(deep copy including children's children etc.) and add to the Node Class
        function dfs(node: Node<WeaponData>, nodeToCopy: Node<WeaponData>){
            nodeToCopy.children.forEach((childToCopy, i)=>{
                // Create Node class from children of nodeToCopy
                let child = WeaponUpgradeFactory.createNode(childToCopy)
                node.children.push(child)

                // Copy the childToCopy's children/descendants also
                dfs(child, childToCopy)
            })
        }

        dfs(root, upgrade.root)

        if(selectRoot){
            root.data.status = "selected"
            root.data.selectionTime = 0
        }

        return root
    }

    /**
     * Note: For testing
     * @returns returns a tribow upgrade tree's root to be used by a single player
     */
    static createBowUpgrade(){
        return WeaponUpgradeFactory.createUpgrade('1', false)
    }

    static createTribowUpgrade(){
        return WeaponUpgradeFactory.createUpgrade('upgrade-c53e70c0-2a18-41f3-8dec-bd7ca194493d') as Node<WeaponData>
    }

    /**
     * Note: For testing
     * @returns returns a sword upgrade tree's root to be used by a single player
     */
    static createSwordUpgrade(){
        return WeaponUpgradeFactory.createUpgrade('2')
    }
}
import FileUtil from '../../../../util/FileUtil';
import WeaponData from '../../schemas/Trees/Node/Data/WeaponData';
import Node from '../../schemas/Trees/Node/Node';
import Player from '../../schemas/gameobjs/Player';
import Stat from '../../schemas/gameobjs/Stat';

type weapon = {name: string, description: string, sprite: string, projectile: string}
type upgrade = {
    id: string,
    upgradeName: string,
    root: Node<WeaponData>
}

export default class WeaponManager{
    static singleton = new WeaponManager()
    private weapons: Map<string, weapon> = new Map()
    private upgrades: Map<string, upgrade> = new Map()

    constructor() {
        this.loadWeapons()
        this.loadUpgrades()
    }   

    /**
     * Loads weapons frfom assets/weapons/weapons.json into a Map<string, weapon>
     */
    async loadWeapons(){
        let db = await FileUtil.readJSONAsync("assets/db.json")
        for (let upgrade of db.upgrades) {
            this.upgrades.set(upgrade.id, upgrade as upgrade)
        }
        console.log(this.upgrades.get('1')?.root)
    }

    async loadUpgrades(){
        let weapons = await FileUtil.readJSONAsync("assets/weapons/weapons.json")
        for (let [weaponId, weapon] of Object.entries(weapons)) {
            this.weapons.set(weaponId, weapon as weapon)
        }
    }

    /**
     * Returns object with basic weapon information such as name, description, sprite, projectile, etc based on the weaponId parameter.
     * @param weaponId 
     * @returns 
     */
    static getWeapon(weaponId: string){
        return this.singleton.weapons.get(weaponId)
    }
    
    static getTestUpgradeTreeRoot(){
        let node = new Node<WeaponData>(new WeaponData('bow-id'))
        let child1 = new Node<WeaponData>(new WeaponData('child1')) 
        let child2 = new Node<WeaponData>(new WeaponData('child2'))
        
        node.children.push(child1)
        node.children.push(child2)

        return node
    }

    /**
     * Computes total stat a player's weapon tree provides
     * @param playerState 
     */
    static getTotalWeaponStat(playerState: Player){
        let tree = playerState.weaponUpgradeTree
        let totalStats = Stat.getZeroStat()

        //dfs traversal to get stats that have been selected
        function dfs(root: Node<WeaponData>){
            switch(root.data.status){
                case "selected":
                    // TODO add stat to total
                case "none":
                    return
            }
            
            for(let node of root.children){
                dfs(node)
            }
        }

        if(tree.root) dfs(tree.root)
    }

    // could make time complexity better
    static getAvailableUpgrades(playerState: Player){
        let tree = playerState.weaponUpgradeTree
        let root = tree.root
        if(!root) return

        let upgrades: Array<Node<WeaponData>> = []

        //dfs traversal to get next upgrades
        function dfs(root: Node<WeaponData>){
            if(root.data.status === "none")
                return upgrades.push(root)

            for(let node of root.children){
                dfs(node)
            }
        }

        dfs(root)
        return upgrades
    }

    /**
     * Selects/activates the upgrade of a player based on player's choice
     * @param playerState 
     * @param upgrades list of available upgrades to choose from
     * @param choice choice of upgrade, zero indexed
     */
    static selectUpgrade(playerState: Player, upgrades: Array<Node<WeaponData>>, choice: number){
        if(choice < upgrades.length){
            let node = upgrades[choice]
            node.data.status = "selected"

            // ****TODO add upgrade to stat total

            // Change base weapon if node has a weaponId
            let weaponId = node.data.weaponId
            if(weaponId) WeaponManager.setCurrentWeapon(playerState, weaponId)
        }
    }

    /**
     * Sets the base weapon the player is equiping
     * @param playerState
     * @param weaponId id for the new base weapon to equip
     */
    static setCurrentWeapon(playerState: Player, weaponId: string){
        playerState.weapon.setWeapon(weaponId)
    }   

    /**
     * Sets the player's weapon upgrade tree to a copy of the given tree
     * @param playerState
     * @param root root node of weapon upgrade tree to equip
     */
    static setWeaponUpgradeTree(playerState: Player, root: Node<WeaponData>){
        let weaponTree = playerState.weaponUpgradeTree
        weaponTree.root = root
        
        if(root.data.weaponId){
            WeaponManager.setCurrentWeapon(playerState, root.data.weaponId)
        }
    }
}
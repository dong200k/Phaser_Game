// import FileUtil from '../../../../util/FileUtil';
// import SkillData from '../../schemas/Trees/Node/Data/SkillData';
// import WeaponData from '../../schemas/Trees/Node/Data/WeaponData';
// import Node from '../../schemas/Trees/Node/Node';
// import StatTree from '../../schemas/Trees/StatTree';
// import WeaponUpgradeTree from '../../schemas/Trees/WeaponUpgradeTree';
// import Player from '../../schemas/gameobjs/Player';
// import Stat from '../../schemas/gameobjs/Stat';

// type artifact = {name: string, description: string, sprite: string, projectile: string}

// export default class ArtifactManager{
//     static singleton = new ArtifactManager()
//     private artifacts: Map<string, artifact> = new Map()

//     constructor() {
//     }   

//     /**
//      * Loads weapons from assets/weapons/weapons.json into a Map<string, weapon>
//      */
//     async loadArtifacts(){
//         let artifacts = await FileUtil.readJSONAsync("assets/weapons/weapons.json")
//         for (let [artifactId, artifact] of Object.entries(artifacts)) {
//             this.artifacts.set(artifactId, artifact as artifact)
//         }
//     }

//     /**
//      * Returns object with basic artifact information such as name, description, sprite, projectile, etc based on the artifact parameter.
//      * @param artifactId 
//      * @returns 
//      */
//     static getArtifacts(artifactId: string){
//         return this.singleton.artifacts.get(artifactId)
//     }

//     /**
//      * Takes in a weapon or skill tree and computes the total stats the tree provides based on selected upgrades
//      * @param tree
//      * @returns 
//      */
//     static getTotalTreeStat(tree: WeaponUpgradeTree | StatTree<SkillData>){
//         let totalStats = Stat.getZeroStat()

//         //dfs traversal to get stats that have been selected
//         function dfs(root: Node<WeaponData> | Node<SkillData>){
//             switch(root.data.status){
//                 case "selected":
//                     totalStats = Stat.add(totalStats, root.data.stat)
//                     break
//                 case "none":
//                     return
//             }
            
//             for(let node of root.children){
//                 dfs(node)
//             }
//         }

//         if(tree.root) dfs(tree.root)

//         return totalStats
//     }

//     // could make time complexity better
//     static getAvailableUpgrades(tree: WeaponUpgradeTree | StatTree<SkillData>){
//         let root = tree.root
//         if(!root) return []

//         let upgrades: Array<Node<WeaponData> | Node<SkillData>> = []
//         //dfs traversal to get next upgrades
//         function dfs(root: Node<WeaponData> | Node<SkillData>){
//             if(root.data.status === "none")
//                 return upgrades.push(root)

//             for(let node of root.children){
//                 dfs(node)
//             }
//         }

//         dfs(root)
//         return upgrades
//     }

//     /**
//      * Selects/activates the upgrade of a player based on player's choice
//      * @param playerState 
//      * @param upgrades list of available upgrades to choose from
//      * @param choice choice of upgrade, zero indexed
//      */
//     static selectUpgrade(playerState: Player, upgrades: Array<Node<WeaponData> | Node<SkillData>>, choice: number){
//         if(choice < upgrades.length){
//             //Select upgrade
//             let selectedUpgrade = upgrades[choice]
//             selectedUpgrade.data.setStatus("selected")
            
//             // Mark upgrades on the same level as skipped if its a weapon upgrade tree
//             if(upgrades[0].data instanceof WeaponData){
//                 upgrades.forEach((upgrade, i)=>{
//                     if(i!==choice) upgrade.data.setStatus("skipped")
//                 })

//                 // Change base weapon if node has a weaponId
//                 let data = selectedUpgrade.data as WeaponData
//                 let weaponId = data.weaponId
//                 if(weaponId) WeaponManager.setCurrentWeapon(playerState, weaponId)
//             }
            
//             // ****TODO add upgrade to stat total
//         }
//     }

//     /**
//      * Sets the player's weapon upgrade tree with root
//      * @param playerState
//      * @param root root node of weapon upgrade tree to equip
//      */
//     static setWeaponUpgradeTree(playerState: Player, root: Node<WeaponData>){
//         let weaponTree = playerState.weaponUpgradeTree
//         weaponTree.root = root
        
//         if(root.data.weaponId){
//             WeaponManager.setCurrentWeapon(playerState, root.data.weaponId)
//         }

//         // Select this upgrade by default
//         root.data.setStatus("selected")
//     }

//     static getManager(){
//         return ArtifactManager.singleton
//     }
// }
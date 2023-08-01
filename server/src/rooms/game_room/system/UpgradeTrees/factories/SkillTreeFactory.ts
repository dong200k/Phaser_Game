import FileUtil from "../../../../../util/FileUtil"
import SkillData from "../../../schemas/Trees/Node/Data/SkillData"
import Node from "../../../schemas/Trees/Node/Node"
import Stat from "../../../schemas/gameobjs/Stat"
import DatabaseManager from "../../Database/DatabaseManager"

export default class SkillTreeFactory{
    /**
     * Creates a Node class from a single node from an skill from db formatted as a json (does not copy children)
     * @param copy single node from a skill in db.json formatted as json
     * @returns 
     */
    private static createNode(copy: Node<SkillData>){
        let {name, description, stat, coinCost, status} = copy.data
        stat = new Stat(stat)
        let skillData = new SkillData(stat, name, description, coinCost, status)
        let node = new Node<SkillData>(skillData, copy.id)

        return node
    }

    /**
     * Converts a player's firebase skilltree to Node<SkillData> format
     * @param skillTree a player's skill tree from firebase
     * @returns 
     */
    static convertFirebaseSkillTree(skillTree: any){
        // Takes in a Node class and a db.json nodeToCopy.
        // creates class Nodes from all the children of nodeToCopy(deep copy including children's children etc.) and add to the Node Class
        function dfs(node: Node<SkillData>, nodeToCopy: Node<SkillData>){
            nodeToCopy.children.forEach((childToCopy, i)=>{
                // Create Node class from children of nodeToCopy
                let child = SkillTreeFactory.createNode(childToCopy)
                node.children.push(child)

                // Copy the childToCopy's children/descendants also
                dfs(child, childToCopy)
            })
        }

        let root = SkillTreeFactory.createNode(skillTree.root)
        dfs(root, skillTree.root)

        return root
    }

    /**
     * Creates a Node with data from database skill
     * @param id id of upgrade from database to create Node from 
     * @returns
     */
    static createSkill(id: string, selectRoot: boolean = true){
        let skill = DatabaseManager.getManager().getSkill(id)
        if(!skill) return

        let root = SkillTreeFactory.createNode(skill.root)
        
        // Takes in a Node class and a db.json nodeToCopy.
        // creates class Nodes from all the children of nodeToCopy(deep copy including children's children etc.) and add to the Node Class
        function dfs(node: Node<SkillData>, nodeToCopy: Node<SkillData>){
            nodeToCopy.children.forEach((childToCopy, i)=>{
                // Create Node class from children of nodeToCopy
                let child = SkillTreeFactory.createNode(childToCopy)
                node.children.push(child)

                // Copy the childToCopy's children/descendants also
                dfs(child, childToCopy)
            })
        }

        dfs(root, skill.root)

        //select the root node
        if(selectRoot) root.data.setStatus("selected")

        return root
    }

    /**
     * Creates fully upgraded adventurer skill tree node
     */
    static createUpgradedAdventurerSkill(selectRoot: boolean = false){
        return SkillTreeFactory.createSkill("skill-a63779a4-c357-4c62-a17d-d3d3606b1b4b", selectRoot) as Node<SkillData>
    }

     /**
     * Creates default un-upgraded adventurer skill tree node
     */
     static createAdventurerSkill(selectRoot: boolean = false){
        return SkillTreeFactory.createSkill("skill-bd5a5c20-d375-46eb-a2dc-dace60afbab9", selectRoot) as Node<SkillData>
    }
}
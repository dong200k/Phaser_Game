import FileUtil from "../../../../util/FileUtil"
import SkillData from "../../schemas/Trees/Node/Data/SkillData"
import Node from "../../schemas/Trees/Node/Node"
import StatTree from "../../schemas/Trees/StatTree"
import Stat from "../../schemas/gameobjs/Stat"
type skillTree = {
    id: string,
    upgradeName: string,
    root: Node<SkillData>
}
export default class SkillTreeFactory{
    static singleton = new SkillTreeFactory()
    private skillTrees: Map<string, skillTree> = new Map()

    /**
     * Loads skill trees from assets/db.json
     */
    async loadStatTrees(){
        let db = await FileUtil.readJSONAsync("assets/db.json")
        let skillTrees = db.skills

        for (let skills of skillTrees) {
            this.skillTrees.set(skills.id, skills)
        }
    }

    /**
     * Creates a Node class from a single node from an skill from db formatted as a json (does not copy children)
     * @param copy single node from a skill in db.json formatted as json
     * @returns 
     */
    private static createNode(copy: Node<SkillData>){
        let {name, description, stat} = copy.data
        stat = new Stat(stat)
        let skillData = new SkillData(stat, name, description)
        let node = new Node<SkillData>(skillData)

        return node
    }

    /**
     * Creates a Node with data from database skill
     * @param id id of upgrade from database to create Node from 
     * @returns
     */
    static createSkill(id: string, selectRoot: boolean = true){
        let skill = SkillTreeFactory.getManager().skillTrees.get(id)
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
     * Creates default adventurere skill tree node
     */
    static createAdventurerSkill(){
        return SkillTreeFactory.createSkill("skill-a63779a4-c357-4c62-a17d-d3d3606b1b4b")
    }

    static createTestSkill(){
        return SkillTreeFactory.createSkill("skill-a1d641ec-5560-47d6-af95-89e6e1ef4dc6")
    }

    static getManager(){
        return SkillTreeFactory.singleton
    }
}
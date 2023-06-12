import FileUtil from '../../../../util/FileUtil';
import SkillData from '../../schemas/Trees/Node/Data/SkillData';
import WeaponData from '../../schemas/Trees/Node/Data/WeaponData';
import Node from '../../schemas/Trees/Node/Node';
import StatTree from '../../schemas/Trees/StatTree';
import Player from '../../schemas/gameobjs/Player';
import Stat from '../../schemas/gameobjs/Stat';

export default class SkillTreeManager{
    static singleton = new SkillTreeManager()
    private skillTrees: Map<string, StatTree<SkillData>> = new Map()

    /**
     * Sets the player's skill upgrade tree with root
     * @param playerState
     * @param root root node of skill tree to equip
     */
    static setSkillTree(playerState: Player, root: Node<SkillData>){
        let skillTree = playerState.skillTree
        skillTree.root = root

        //select the root node
        root.data.setStatus("selected")
    }

    static getManager(){
        return SkillTreeManager.singleton
    }
}
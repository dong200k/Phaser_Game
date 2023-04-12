import Phaser from "phaser";
import { SceneKey } from "../config";
import Checkbox from "../UI/Checkbox";

export default class HostGameScene extends Phaser.Scene {
    
    constructor() {
        super(SceneKey.HostGameScene)
    }

    create() {

        this.add.rectangle(this.game.scale.width / 2, this.game.scale.height / 2, 50, 50, 0x999999);
        

        let checkbox = new Checkbox(this, this.game.scale.width / 2, this.game.scale.height / 2);
        this.add.existing(checkbox);
    }

}
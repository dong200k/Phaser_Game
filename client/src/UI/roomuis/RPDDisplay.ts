import { Sizer } from "phaser3-rex-plugins/templates/ui/ui-components";
import RexUIBase, { SceneWithRexUI } from "../RexUIBase";
import UIFactory from "../UIFactory";
import TextBoxPhaser from "../TextBoxPhaser";

interface RPDDisplayData {
    roleImageKey: string,
    roleName: string,
    petImageKey: string,
    petName: string,
    dungeonImageKey: string,
    dungeonName: string,
}

/**
 * The RPDDisplay displays the role image, role name, pet image, pet name, dungeon image and dungeon name for the RoomScene.
 * These can be updated through its updateDisplay(...) method.
 */
export default class RPDDisplay extends RexUIBase {
    
    private RPDDisplaySizer: Sizer;
    private RPDDisplayData: RPDDisplayData

    constructor(scene: SceneWithRexUI) {
        super(scene);
        this.RPDDisplayData = {
            roleImageKey: "",
            roleName: "Role Name",
            petImageKey: "",
            petName: "Pet Name",
            dungeonImageKey: "",
            dungeonName: "Dungeon Name",
        };
        this.RPDDisplaySizer = this.rexUI.add.sizer({
            orientation: "horizontal",
            space: {
                item: 100
            }
        }).setPosition(this.scene.game.scale.width / 2 - 140, this.scene.game.scale.height / 2 - 100);

        let roleSizer = this.rexUI.add.sizer({
            orientation: "vertical",
        })
        roleSizer.add(this.scene.add.image(0, 0, "").setName("RPDDisplayRoleImage").setDisplaySize(100, 100), {expand: false});
        roleSizer.add(UIFactory.createTextBoxPhaser(this.scene, "Role", "l4").setName("RPDDisplayRoleName"), {expand: false});

        let petSizer = this.rexUI.add.sizer({
            orientation: "vertical",
        })
        petSizer.add(this.scene.add.image(0, 0, "").setName("RPDDisplayPetImage").setDisplaySize(100, 100), {expand: false});
        petSizer.add(UIFactory.createTextBoxPhaser(this.scene, "Pet", "l4").setName("RPDDisplayPetName"), {expand: false});

        let dungeonSizer = this.rexUI.add.sizer({
            orientation: "vertical",
        })
        dungeonSizer.add(this.scene.add.image(0, 0, "").setName("RPDDisplayDungeonImage").setDisplaySize(100, 100), {expand: false});
        dungeonSizer.add(UIFactory.createTextBoxPhaser(this.scene, "Dungeon", "l4").setName("RPDDisplayDungeonName"), {expand: false});

        this.RPDDisplaySizer.add(roleSizer);
        this.RPDDisplaySizer.add(petSizer);
        this.RPDDisplaySizer.add(dungeonSizer);

        this.updateDisplay({});
    }

    public updateDisplay(data: Partial<RPDDisplayData>) {
        Object.assign(this.RPDDisplayData, data);

        (this.RPDDisplaySizer.getByName("RPDDisplayRoleImage", true) as Phaser.GameObjects.Image).setTexture(this.RPDDisplayData.roleImageKey);
        (this.RPDDisplaySizer.getByName("RPDDisplayPetImage", true) as Phaser.GameObjects.Image).setTexture(this.RPDDisplayData.petImageKey);
        (this.RPDDisplaySizer.getByName("RPDDisplayDungeonImage", true) as Phaser.GameObjects.Image).setTexture(this.RPDDisplayData.dungeonImageKey);

        (this.RPDDisplaySizer.getByName("RPDDisplayRoleName", true) as TextBoxPhaser).setText(this.RPDDisplayData.roleName);
        (this.RPDDisplaySizer.getByName("RPDDisplayPetName", true) as TextBoxPhaser).setText(this.RPDDisplayData.petName);
        (this.RPDDisplaySizer.getByName("RPDDisplayDungeonName", true) as TextBoxPhaser).setText(this.RPDDisplayData.dungeonName);

        this.RPDDisplaySizer.layout();
    }

}
import { Buttons, Dialog, Sizer } from "phaser3-rex-plugins/templates/ui/ui-components";
import UIPlugins from "phaser3-rex-plugins/templates/ui/ui-plugin";
import { ColorStyle } from "../config";
import UIFactory from "./UIFactory";

interface Stats {
    hp?: number;
    mp?: number;
    attackRange?: number;
    attackSpeed?: number;
    speed?: number;
    attack?: number;
    magicAttack?: number;
    critRate?: number;
    critDamage?: number;
    lifeSteal?: number;
    armor?: number;
    magicResist?: number;
    armorPen?: number;
    magicPen?: number;
}

interface RoleData {
    name: string;
    imageKey?: string;
    description?: string;
    stats?: Stats;
}

interface RoleModalData {
    roles: RoleData[];
    selected: number;
}

interface SceneWithRexUI extends Phaser.Scene {
    rexUI: UIPlugins;
}

interface RoleModalConfig {
    roleModalData: RoleModalData;
    type: "Pet" | "Dungeon" | "Role";
    confirmOnClick: (roleName: string) => void;
}

/**
 * RoleModal is a helpful UI Modal that can be used to choose roles, dungeons, and pets.
 */
export default class RoleModal {

    scene: SceneWithRexUI;
    private roleModalData: RoleModalData;
    private modalContent: Sizer;
    private dialog: Dialog;
    private type: "Pet" | "Dungeon" | "Role";

    constructor(scene: SceneWithRexUI, config: RoleModalConfig) {
        this.scene = scene;
        this.roleModalData = config.roleModalData;
        this.type = config.type;
        this.dialog = this.scene.rexUI.add.dialog({
            background: scene.rexUI.add.roundRectangle(0, 0, 100, 100, 0, ColorStyle.primary.hex[900]),
            content: this.createRoleModalContent(() => {this.dialog.modalClose()}, (roleName: string) => {
                config.confirmOnClick(roleName);
                this.dialog.modalClose();
            }),
        })

        this.modalContent = this.dialog.getByName("modalContent") as Sizer;

        this.updateDetailsDisplay();
    }

    public getDialog() {
        return this.dialog;
    }

    private createRoleModalContent(cancelOnClick: () => void, confirmOnClick: (roleName:string) => void) {
        let modalContent = this.scene.rexUI.add.sizer({
            orientation: "horizontal",
            space: {
                left: 20,
                right: 20,
                bottom: 20,
                top: 20,
                item: 20,
            },
            name: "modalContent",
        })
        
        // Left content contains the role options and confirm buttons.
        let roleAndButtonsSizer = this.scene.rexUI.add.sizer({
            orientation: "vertical",
            space: {
                item: 20
            }
        })
        roleAndButtonsSizer.add(this.createOptions(this.roleModalData.roles));
        roleAndButtonsSizer.add(this.createConfirmButtons({
            cancelText: "Cancel",
            confirmText: `Select ${this.type}`,
            cancelOnclick: cancelOnClick,
            confirmOnclick: () => {confirmOnClick(this.roleModalData.roles[this.roleModalData.selected].name)}
        }), {align: "right"});

        // Swapped left and right content.
        modalContent.add(roleAndButtonsSizer);
        
        return modalContent;
    }

    private updateDetailsDisplay() {
        let gameObject = this.modalContent.getByName("detailsDisplay");
        if(gameObject)
            this.modalContent.remove(gameObject, true);
        this.modalContent.add(this.createDetailsDisplay(this.roleModalData.roles[this.roleModalData.selected]), {index: 0});
        this.modalContent.layout();
    }

    private createDetailsDisplay(roleData: RoleData) {
        let roleName = roleData.name;
        let imageKey = roleData.imageKey ?? "";
        let roleDescription = roleData.description ?? "No description.";
        let stats = roleData.stats ?? {};
        // Right content contains the role details panel
        let detailsSizer = this.scene.rexUI.add.fixWidthSizer({
            width: 620,
            height: 436,
            space: {
                line: 24,
                item: 20,
                left: 40,
                right: 40,
                top: 40,
                bottom: 40
            },
            name: "detailsDisplay",
        })
        detailsSizer.addBackground(this.scene.rexUI.add.roundRectangle(0, 0, 100, 100, 0, ColorStyle.primary.hex[500]));
        detailsSizer.add(UIFactory.createTextBoxPhaser(this.scene, roleName, "h3").setWordWrapWidth(550).setMaxLines(1));
        detailsSizer.addNewLine();
        detailsSizer.add(this.scene.add.image(0, 0, imageKey).setDisplaySize(128, 128));
        detailsSizer.add(UIFactory.createTextBoxPhaser(this.scene, roleDescription, "p5").setWordWrapWidth(400).setAlign("left"));
        if(roleData.stats !== undefined) {
            detailsSizer.addNewLine();
            detailsSizer.add(UIFactory.createTextBoxPhaser(this.scene, "STATS", "h5"), {padding: {top: 20}})
            detailsSizer.addNewLine();
            detailsSizer.add(this.createStatsDisplay(stats));
        }
        return detailsSizer;
    }

    private createStatsDisplay(stats: Stats) {
        let hSizer = this.scene.rexUI.add.sizer({
            orientation: "horizontal",
            space: {
                item: 150
            }
        })
        let vSizer1 = this.scene.rexUI.add.sizer({
            orientation: "vertical",
        })
        if(stats.hp !== undefined) vSizer1.add(UIFactory.createTextBoxPhaser(this.scene, `HP: ${stats.hp}`, "p5"), {align: "left"});
        if(stats.mp !== undefined) vSizer1.add(UIFactory.createTextBoxPhaser(this.scene, `MP: ${stats.mp}`, "p5"), {align: "left"});
        if(stats.attackRange !== undefined) vSizer1.add(UIFactory.createTextBoxPhaser(this.scene, `ATTACK RANGE: ${stats.attackRange}`, "p5"), {align: "left"});
        if(stats.attackSpeed !== undefined) vSizer1.add(UIFactory.createTextBoxPhaser(this.scene, `ATTACK SPEED: ${stats.attackSpeed}`, "p5"), {align: "left"});
        if(stats.speed !== undefined) vSizer1.add(UIFactory.createTextBoxPhaser(this.scene, `MOVEMENT SPEED: ${stats.speed}`, "p5"), {align: "left"});
        hSizer.add(vSizer1, {align: "top"});

        let vSizer2 = this.scene.rexUI.add.sizer({
            orientation: "vertical",
        })
        if(stats.attack !== undefined) vSizer2.add(UIFactory.createTextBoxPhaser(this.scene, `ATTACK: ${stats.attack}`, "p5"), {align: "left"});
        if(stats.magicAttack !== undefined) vSizer2.add(UIFactory.createTextBoxPhaser(this.scene, `MAGIC ATTACK: ${stats.magicAttack}`, "p5"), {align: "left"});
        if(stats.critRate !== undefined) vSizer2.add(UIFactory.createTextBoxPhaser(this.scene, `CRIT RATE: ${stats.critRate}`, "p5"), {align: "left"});
        if(stats.critDamage !== undefined) vSizer2.add(UIFactory.createTextBoxPhaser(this.scene, `CRIT DAMAGE: ${stats.critDamage}`, "p5"), {align: "left"});
        if(stats.lifeSteal !== undefined) vSizer2.add(UIFactory.createTextBoxPhaser(this.scene, `LIFE STEAL: ${stats.lifeSteal}`, "p5"), {align: "left"});
        hSizer.add(vSizer2, {align: "top"});

        let vSizer3 = this.scene.rexUI.add.sizer({
            orientation: "vertical",
        })
        if(stats.armor !== undefined) vSizer3.add(UIFactory.createTextBoxPhaser(this.scene, `ARMOR: ${stats.armor}`, "p5"), {align: "left"});
        if(stats.magicResist !== undefined) vSizer3.add(UIFactory.createTextBoxPhaser(this.scene, `MAGIC RESIST: ${stats.magicResist}`, "p5"), {align: "left"});
        if(stats.armorPen !== undefined) vSizer3.add(UIFactory.createTextBoxPhaser(this.scene, `ARMOR PEN: ${stats.armorPen}`, "p5"), {align: "left"});
        if(stats.magicPen !== undefined) vSizer3.add(UIFactory.createTextBoxPhaser(this.scene, `MAGIC PEN: ${stats.magicPen}`, "p5"), {align: "left"});
        hSizer.add(vSizer3, {align: "top"});

        return hSizer;
    }

    private createConfirmButtons(config: {cancelText?: string, confirmText?: string, cancelOnclick: Function, confirmOnclick: Function}) {
        let buttons = this.scene.rexUI.add.sizer({
            orientation: "horizontal",
            width: 325,
            height: 70,
            space: {
                item: 30,
            }
        });
        buttons.add(UIFactory.createButtonRex(this.scene, {
            text: config.cancelText,
            buttonSize: "regular",
        }).onClick((click, gameObject, pointer) => {config.cancelOnclick()}));
        buttons.add(UIFactory.createButtonRex(this.scene, {
            text: config.confirmText,
            buttonSize: "regular",
        }).onClick((click, gameObject, pointer) => {config.confirmOnclick()}));
        return buttons;
    }

    /**
     * Create a scrollable options panel to select roles, dungeons, or pets.
     * @returns A ScrollablePanel
     */
    private createOptions(data: {name: string, imageKey?: string}[]) {
        let options = this.scene.rexUI.add.scrollablePanel({
            x: 0,
            y: 0,
            width: 325,
            height: 350,
            scrollMode: "vertical",
            panel: {
                child: this.scene.rexUI.add.buttons({
                    orientation: "vertical",
                    space: {
                        item: 5,
                    },
                    type: "radio",
                    setValueCallback: (button, value, previousValue) => {
                        (button as any).getByName("background", true).setFillStyle(value? ColorStyle.primary.hex[100]:ColorStyle.primary.hex[500]);
                    },
                    name: "optionButtons",
                }),
                mask: {
                    padding: 1,
                    updateMode: 1,
                }
            },
            slider: {
                track: this.scene.rexUI.add.roundRectangle(0, 0, 20, 10, 0, ColorStyle.primary.hex[500]),
                thumb: this.scene.rexUI.add.roundRectangle(0, 0, 0, 0, 10, ColorStyle.neutrals.hex[900]),
                adaptThumbSize: true,
            },
            mouseWheelScroller: {
                focus: false,
                speed: 0.15
            },
            space: {
                panel: 5
            }
        })

        // Add option buttons.
        let buttons = options.getElement("panel") as Buttons;
        for(let i = 0; i < data.length; i++) {
            buttons.addButton(this.createOptionItem(data[i].name, data[i].imageKey));
        }

        // Set up event handlers for button events.
        buttons.on("button.click", () => {
                if(options.isInTouching("mask")) {
                    this.roleModalData.roles.forEach((data, idx) => {
                        if(data.name === buttons.value) this.roleModalData.selected = idx;
                        this.updateDetailsDisplay();
                    })
                }
            })
            .on("button.over", (child: Sizer) => {
                if(options.isInTouching("mask"))
                    (child.getByName("background", true) as any).setStrokeStyle(3, ColorStyle.neutrals.hex.white);
            })
            .on("button.out", (child: Sizer) => {
                (child.getByName("background", true) as any).setStrokeStyle();
            })

        // Selects the initial button.
        buttons.setSelectedButtonName(this.roleModalData.roles[this.roleModalData.selected].name);

        return options;
    }

    /**
     * Creates an options item Sizer that includes a name and imageKey.
     * @param name The name.
     * @param imageKey The image texture key.
     * @returns A Sizer.
     */
    private createOptionItem(name: string, imageKey: string = "") {
        let itemWraper = this.scene.rexUI.add.sizer({
            name: name,
            width: 300,
            height: 64,
        });

        let item = this.scene.rexUI.add.sizer({
            orientation: "horizontal",
            width: 300,
            height: 64,
            name: "optionItem",
        })
        item.addBackground(this.scene.rexUI.add.roundRectangle(0, 0, 300, 64, 0, ColorStyle.primary.hex[500]).setName("background"));
        item.add(this.scene.add.image(0, 0, imageKey).setDisplaySize(64, 64));
        item.add(UIFactory.createTextBoxPhaser(this.scene, name, "p3").setWordWrapWidth(200).setMaxLines(2).setAlign("left"), {align: 'top', padding: {left: 10, top: 8}});
        
        itemWraper.add(item);
        return itemWraper;
    }
}
import { Dialog } from "phaser3-rex-plugins/templates/ui/ui-components";
import UIPlugins from "phaser3-rex-plugins/templates/ui/ui-plugin";

interface SceneWithRexUI extends Phaser.Scene {
    rexUI: UIPlugins;
}

export interface BaseModalConfig {

}

/**
 * The base modal class contains some setup code to create a modal that can automatally popup on create.
 * It also blocks all inputs from moving into the gameobjects underneath it.
 */
export default abstract class BaseModal {
    scene: SceneWithRexUI;
    protected dialog: Dialog;
    private defaultInputTopOnly: boolean;

    constructor(scene: SceneWithRexUI, config: BaseModalConfig) {
        this.scene = scene;
        this.dialog = this.createDialog(config);
        this.dialog.setPosition(this.scene.game.scale.width / 2, this.scene.game.scale.height / 2);
        this.dialog.layout();
        this.defaultInputTopOnly = this.scene.input.topOnly;
        this.scene.input.setTopOnly(true); // Makes it so that only the modal can be interacted.
        this.dialog.modalPromise({
            manualClose: true,
        }).then(() => {
            this.scene.input.setTopOnly(this.defaultInputTopOnly);
            this.dialog.destroy();
        })
    }

    /**
     * Closes and destroys this modal.
     */
    public closeModal() {
        this.dialog.modalClose();
    }

    /** Creates the dialog GUI for this modal. */
    protected abstract createDialog(config: BaseModalConfig): Dialog;
}

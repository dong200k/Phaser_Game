import { Dialog } from "phaser3-rex-plugins/templates/ui/ui-components";
import UIPlugins from "phaser3-rex-plugins/templates/ui/ui-plugin";

interface SceneWithRexUI extends Phaser.Scene {
    rexUI: UIPlugins;
}

export interface BaseModalConfig {

}

/**
 * The BaseModal is an abstract class that contains some setup code to create a popup modal. 
 * This modal automatically pop ups on creation and automatically destroys on completion. 
 * This modal blocks all inputs from emiting into the gameobjects underneath it.
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
            clickOutsideClose: true,
            duration: {
                in: 200,
                out: 0,
            }
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

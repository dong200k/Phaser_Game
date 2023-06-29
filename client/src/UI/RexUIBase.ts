import UIPlugins from "phaser3-rex-plugins/templates/ui/ui-plugin";

export interface SceneWithRexUI extends Phaser.Scene {
    rexUI: UIPlugins;
}

/** An abstract class used to create UI elements with rexUI and scene included at construction. */
export default abstract class RexUIBase {

    protected rexUI: UIPlugins;
    protected scene: SceneWithRexUI;

    constructor(scene: SceneWithRexUI) {
        this.scene = scene;
        this.rexUI = scene.rexUI;
    }
    
}
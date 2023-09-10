import { ColorStyle } from "../../config";
import UIFactory from "../UIFactory";
import { Dialog, FixWidthSizer, RoundRectangle, Sizer, TextBox } from "phaser3-rex-plugins/templates/ui/ui-components";
import RexUIBase, { SceneWithRexUI } from "../RexUIBase";
import TextBoxRex from "../TextBoxRex";

interface InfoData {
    /** The current wave of the game. */
    wave?: number;
    /** The maxWave of the game. -1 if there is none. */
    maxWave?: number;
    /** The coins the player earned. */
    coins?: number;
}

export default class TopRightInfo extends RexUIBase {

    private infoSizer: Sizer;
    private infoData: InfoData;

    constructor(scene: SceneWithRexUI) {
        super(scene);
        this.infoSizer = this.createInfoSizer();
        this.infoData = {
            wave: 1,
            maxWave: -1,
            coins: 0,
        }
        this.updateInfoSizer({});
    }

    private createInfoSizer() {

        let sizer = this.rexUI.add.sizer({
            orientation: "vertical",
            // width: 400,
            anchor: {
                top: "top+10",
                right: "right-10",
            }
        });

        sizer.add(UIFactory.createTextBoxRex(this.scene, "Wave Count: 10").setName("InfoWaveCount"), {expand: false});
        sizer.add(UIFactory.createTextBoxRex(this.scene, "Coins: 10").setName("InfoCoinCount"), {expand: false});

        return sizer;
    }

    /**
     * Updates the text of this info display.
     * @param data The InfoData.
     */
    public updateInfoSizer(data: InfoData) {

        Object.assign(this.infoData, data);

        let textBoxWave = this.infoSizer.getByName("InfoWaveCount", true) as TextBoxRex;
        let textBoxCoin = this.infoSizer.getByName("InfoCoinCount", true) as TextBoxRex;
        
        if(this.infoData.maxWave === -1) {
            textBoxWave.setText(`Wave: ${this.infoData.wave}`);
        } else {
            textBoxWave.setText(`Wave: ${this.infoData.wave} / ${this.infoData.maxWave}`);
        }
        textBoxCoin.setText(`Coins: ${this.infoData.coins}`);

        this.infoSizer.layout();
    }

    public getSizer() {
        return this.infoSizer;
    }
    

}
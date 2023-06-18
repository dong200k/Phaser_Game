import { FixWidthSizer } from "phaser3-rex-plugins/templates/ui/ui-components";
import UIPlugins from "phaser3-rex-plugins/templates/ui/ui-plugin";
import PeerInfo, { PeerInfoData } from "./PeerInfo";
import { ColorStyle } from "../../config";
import CircleImage from "../CircleImage";

interface SceneWithRexUI extends Phaser.Scene {
    rexUI: UIPlugins;
}

export default class PeerInfoPopup {

    private rexUI: UIPlugins;
    private scene: SceneWithRexUI;
    private peerInfoSizer: FixWidthSizer;
    private peerInfoMap: Map<string, PeerInfo>;

    constructor(scene: SceneWithRexUI) {
        this.scene = scene;
        this.rexUI = scene.rexUI;
        this.peerInfoMap = new Map<string, PeerInfo>();

        this.peerInfoSizer = this.rexUI.add.fixWidthSizer({
            width: 850,
            space: {
                top: 20, 
                left: 30,
                bottom: 20,
                right: 30,
                item: 10,
                line: 8,
            },
            align: "justify"
        })
        this.peerInfoSizer.addBackground(this.rexUI.add.roundRectangle(0, 0, 100, 100, 10, ColorStyle.primary.hex[900]));
        
        // let peerInfos = [];

        // for(let i = 0; i < 1; i++) {
        //     let peerInfo = new PeerInfo(this.scene, {});
        //     peerInfos.push(peerInfo);
        //     this.peerInfoSizer.add(peerInfo.getPeerInfoSizer());
        // }
        
        
        this.peerInfoSizer.setPosition(this.scene.game.scale.width / 2, this.scene.game.scale.height / 2 - 20);
        this.peerInfoSizer.setAlpha(0.95);
        this.peerInfoSizer.layout();

        // peerInfos.forEach((e) => { //This step is used to layout the ui.
        //     e.updatePeerInfoData({});
        // })

    }

    /** Creates a new Peer Info display in this popup.
     * @param key The key of the PeerInfo.
     */
    public createNewPeerInfo(key: string) {
        if(this.peerInfoMap.size >= 10) {
            // console.log("MAX PeerInfo Reached.");
            return;
        }

        if(!this.peerInfoMap.has(key)) {
            let peerInfo = new PeerInfo(this.scene, {});
            this.peerInfoMap.set(key, peerInfo);
            this.peerInfoSizer.add(peerInfo.getPeerInfoSizer());
        }
        this.update();
    }

    /** Updates a PeerInfo in this popup.
     * @param key The key of the PeerInfo.
     * @param data The PeerInfoData to update.
     */
    public updatePeerInfo(key?: string, data?: Partial<PeerInfoData>) {
        if(!key || !data) return;
        if(!this.peerInfoMap.has(key)) {
            this.createNewPeerInfo(key);
        }
        this.peerInfoMap.get(key)?.updatePeerInfoData(data);
    }

    /**
     * Removes a PeerInfo from this popup.
     * @param key The key of the PeerInfo.
     */
    public removePeerInfo(key?: string) {
        if(!key) return;
        let peerInfo = this.peerInfoMap.get(key);
        if(peerInfo) {
            this.peerInfoMap.delete(key);
            this.peerInfoSizer.remove(peerInfo.getPeerInfoSizer());
        }
        this.update();
    }

    /**
     * Removes all the PeerInfo. This is used to reset the PeerInfoPopup.
     */
    public removeAllPeerInfo() {
        this.peerInfoMap.forEach((value, key) => {
            this.removePeerInfo(key);
        })
    }

    /**
     * Sets the visibility of this popup to show/hide this popup.
     * @param value True or False
     */
    public setVisible(value: boolean) {
        this.peerInfoSizer.setVisible(value);
        this.peerInfoSizer.getAllChildren().forEach((child) => {
            if(child instanceof CircleImage) child.updateMask();
        })
    }

    /** Layouts this popup. */
    public update() {
        this.peerInfoSizer.layout();

        this.peerInfoMap.forEach((value) => {
            value.updatePeerInfoData({});
        })

        this.peerInfoSizer.getAllChildren().forEach((child) => {
            if(child instanceof CircleImage) child.updateMask();
        })
    }

    public getPeerInfoSizer() {
        return this.peerInfoSizer;
    }

}
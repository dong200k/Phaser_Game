import { ScrollablePanel, Sizer } from "phaser3-rex-plugins/templates/ui/ui-components";
import RexUIBase, { SceneWithRexUI } from "./RexUIBase";
import { ColorStyle, TextStyle } from "../config";

interface ChatBoxConfig {
    width?: number;
    height?: number;
    x?: number;
    y?: number;
}

export default class ChatBox extends RexUIBase {

    private chatBoxSizer: Sizer;
    private domInput: Phaser.GameObjects.DOMElement;
    private domTextArea: Phaser.GameObjects.DOMElement;

    constructor(scene: SceneWithRexUI, config?: ChatBoxConfig) {
        super(scene);

        let width = config?.width ?? 350;
        let height = config?.height ?? 200;

        this.chatBoxSizer = this.rexUI.add.sizer({
            orientation: "vertical",
            space: {
                left: 2,
                right: 2,
                top: 2,
                bottom: 2,
            }
            // width: width,
            // height: height,
        });
        this.chatBoxSizer.addBackground(this.rexUI.add.roundRectangle(0, 0, 100, 100, 0, ColorStyle.primary.hex[900]));
        this.chatBoxSizer.setPosition(config?.x ?? this.scene.game.scale.width / 2, config?.y ?? this.scene.game.scale.height / 2);

        this.domTextArea = this.scene.add.dom(0, 0, "textarea", {
            'width': `${width - 50}px`,
            'height': '160px',
            'padding': '2px',
            'color': ColorStyle.neutrals[100],
            'border-color': ColorStyle.primary[900],
            'background-color': ColorStyle.primary[500],
            'resize': 'none',
            // 'min-height': '200px',
        });
        this.domTextArea.node.setAttribute('readonly', 'true');

        this.domInput = this.scene.add.dom(0, 0, "input", {
            'background-color': ColorStyle.primary[500],
            'width': `${width - 50}px`,
            'height': `23px`,
            'font-family': TextStyle.p6.fontFamily,
            'font-size': TextStyle.p6.fontSize,
            'color': ColorStyle.neutrals[100],
            'border-color': ColorStyle.primary[900],
            'border-style': 'solid',
            'border-radius': '2px',
            'padding': '0px 2px 0px 2px',
        });
        
        this.chatBoxSizer.add(this.domTextArea);
        this.chatBoxSizer.add(this.domInput);


        this.appendText("[System] Nope");
        this.appendText("[System] Nope");
        this.appendText("[System] Nope");
        this.appendText("[System] Nope");
        this.appendText("[System] Nope");
        this.appendText("[System] Nope");
        this.appendText("[System] Nope");
        this.appendText("[System] Nope");
        this.appendText("[System] Nope");
        this.appendText("[System] Nope");

        this.chatBoxSizer.layout();
    }

    public setText(text: string) {
        this.domTextArea.node.textContent = text;
    }

    public appendText(text: string) {
        this.domTextArea.node.textContent += text + "\n";
    }

    public getChatBoxSizer() {
        return this.chatBoxSizer;
    }
}
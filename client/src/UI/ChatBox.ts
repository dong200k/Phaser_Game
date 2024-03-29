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

    private submitCallback?: (value: string) => void;

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
        this.domInput.node.setAttribute('placeholder', "Chat here...");
        let inputNode = (this.domInput.node as HTMLInputElement);
        let form = this.scene.add.dom(0, 0, "form");
        let formNode = (form.node as HTMLFormElement);
        formNode.setAttribute("type", "submit");
        formNode.appendChild(inputNode);
        formNode.addEventListener("submit", (e) => {
            e.preventDefault();
            if(this.submitCallback) {
                this.submitCallback(inputNode.value);
                inputNode.value = "";
            }
        })

        
        this.chatBoxSizer.add(this.domTextArea);
        this.chatBoxSizer.add(this.domInput);

        this.chatBoxSizer.layout();

        this.chatBoxSizer.onClickOutside(() => {
            (this.domInput.node as HTMLInputElement).blur();
            (this.domTextArea.node as HTMLTextAreaElement).blur();
        })
    }

    public setText(text: string) {
        this.domTextArea.node.textContent = text;
    }

    public appendText(text: string) {
        // Adds new text to the textarea. The textarea autoscrolls if the textarea is scrolled all the way to the bottom.
        let ta = (this.domTextArea.node as HTMLTextAreaElement);
        let shouldScroll = Math.abs(ta.scrollTop - (ta.scrollHeight - ta.clientHeight)) < 10;
        ta.textContent += text + "\n";
        if(shouldScroll) ta.scrollTo({top: ta.scrollHeight});
    }

    /** Sets the callback that will be called when the input is submited. 
     * The callback will be called with the value of the input. The input is then cleared.
     */
    public setSubmitCallback(callback: (value: string) => void) {
        this.submitCallback = callback;
    }

    public getChatBoxSizer() {
        return this.chatBoxSizer;
    }
}
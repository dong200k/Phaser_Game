import { Dialog } from "phaser3-rex-plugins/templates/ui/ui-components";
import RexUIBase from "../RexUIBase";
import { ColorStyle } from "../../config";
import UIFactory from "../UIFactory";
import TextBoxPhaser from "../TextBoxPhaser";

interface DialogItem {
    speaker: string;
    icon: string;
    text: string;
    textSpeed?: number;
}

interface DialogData {
    defaultTextSpeed?: number;
    dialogItems: DialogItem[];
}

/**
 * The DialogBox is where the narrator will talk to the player.
 * The idea is that when the player is in the tutorial. The 
 * DialogBox will appear and give the player some information on how 
 * to proceed.
 */
export default class DialogBox extends RexUIBase {

    private popup?: Dialog;
    private dialogData?: DialogData;
    /** The current substring of text to display from 0 to currentSubstringIdx. */
    private currentSubstringIdx: number = 0;
    /** The current dialog item to display. */
    private currentDialogItemIdx: number = 0;

    /**
     * Displays the dialogBox for the player.
     * @param dialogData The DialogData. (Note: the defaultTextSpeed will be set to 5 if none is given. )
     */
    public showDialogBox(dialogData: DialogData) {
        // Clean up old popup.
        if(this.popup) {
            this.popup.destroy();
        }
        // Initialize variables.
        this.currentSubstringIdx = 0;
        this.currentDialogItemIdx = 0;
        this.dialogData = dialogData;
        if(this.dialogData.defaultTextSpeed === undefined) {
            this.dialogData.defaultTextSpeed = 5;
        }
        // Create popup.
        this.popup = this.rexUI.add.dialog({
            height: 200,
            background: this.rexUI.add.roundRectangle(0, 0, 100, 100, 5, ColorStyle.primary.hex[900]),
            content: this.createContent(dialogData),
            space: {
                top: 0,
                left: 0,
                bottom: 10,
                right: 0,
                action: 10,
                title: 15,
            },
            anchor: {
                bottom: "bottom-20",
                right: "right-50",
            }
        })
            .setVisible(true)
            .layout()
            .on("destroy", () => {
                this.popup = undefined;
                this.dialogData = undefined;
            });
        
        this.popup.layout();
        
        // Set popup initial position.
        // this.popup.setPosition(this.scene.game.scale.width/2, this.scene.game.scale.height/2);
    }

    /**
     * Updates this dialog box. This is so that characters can appear in 
     * sequence.
     * @param deltaT The time that passed in seconds.
     */
    public update(deltaT: number) {
        if(this.popup && this.dialogData) {
            let textBox = this.popup.getByName("content_text", true) as TextBoxPhaser;
            let contentSpeaker = this.popup.getByName("content_speaker", true) as TextBoxPhaser;
            let dialogItems = this.dialogData.dialogItems;
            if(dialogItems.length <= this.currentDialogItemIdx) {
                // Remove the popup when the dialog finishes.
                this.popup.destroy();
            } else {
                let dialogItem = this.dialogData.dialogItems[this.currentDialogItemIdx];
                contentSpeaker.setText(dialogItem.speaker);
                textBox.setText(dialogItem.text.substring(0, this.currentSubstringIdx));
                if(this.currentSubstringIdx < dialogItem.text.length) {
                    // increment substring idx.
                    this.currentSubstringIdx++;
                }
                this.popup.layout();
            }
        }
    }

    public createContent(data: DialogData) {
        let content = this.rexUI.add.fixWidthSizer({
            width: 800,
            height: 200,
            space: {
                top: 20,
                right: 20,
                bottom: 20, 
                left: 20,
                line: 20,
            },
            align: "left",
        });
        content.addBackground(this.rexUI.add.roundRectangle(0,0,1,1,0,ColorStyle.primary.hex[500]).setStrokeStyle(6, ColorStyle.primary.hex[900]));
        content.add(UIFactory.createTextBoxPhaser(this.scene, "", "h4").setName("content_speaker"));
        content.addNewLine();
        content.add(UIFactory.createTextBoxPhaser(this.scene, "", "p4").setWordWrapWidth(760).setName("content_text").setAlign("left"));

        return content;
    }

}

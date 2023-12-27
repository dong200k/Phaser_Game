import { Dialog } from "phaser3-rex-plugins/templates/ui/ui-components";
import RexUIBase from "../RexUIBase";
import { ColorStyle } from "../../config";
import UIFactory from "../UIFactory";
import TextBoxPhaser from "../TextBoxPhaser";

interface DialogItem {
    speaker: string;
    icon: string;
    text: string;
    /** The speed of character appearance in characters per second. */
    textSpeed?: number;
}

interface DialogData {
    /** The default speed of which characters will appear. In characters per second. */
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
    /** The speed of character appearance in characters per second. */
    private textSpeed: number = 0;
    /** The timeTracker increments every update and when a new character is displayed it will decrement based on the textSpeed. */
    private timeTracker: number = 0;


    private DEFAULT_TEXT_SPEED: number = 38;

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
        this.textSpeed = this.dialogData.defaultTextSpeed ?? this.DEFAULT_TEXT_SPEED;
        this.timeTracker = 0;
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
            })
            .onClick(() => {
                this.textSpeed = 500;
                if(this.popup && this.dialogData) {
                    let dialogItem = this.dialogData.dialogItems[this.currentDialogItemIdx];
                    if(this.currentSubstringIdx >= dialogItem.text.length) {
                        // Current text completed, change to the next text.
                        this.currentDialogItemIdx++;
                        if(this.currentDialogItemIdx >= this.dialogData.dialogItems.length) {
                            this.popup.destroy();
                        } else {
                            this.timeTracker = 0;
                            this.currentSubstringIdx = 0;
                        }
                    }
                }
                
            })
        
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
        this.timeTracker += deltaT;
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
                    // Todo: increment substring idx based on defaultTextSpeed or textSpeed.
                    // Todo: play a sound when a character is displayed.
                    if(this.currentSubstringIdx === 0) {
                        this.textSpeed = dialogItem.textSpeed ?? this.dialogData.defaultTextSpeed ?? this.DEFAULT_TEXT_SPEED;
                    }
                    let secondsPerCharacter = 1 / this.textSpeed;
                    while(this.timeTracker >= secondsPerCharacter) {
                        this.timeTracker -= secondsPerCharacter;
                        this.currentSubstringIdx++;
                    }
                } else {
                    if(this.currentDialogItemIdx === this.dialogData.dialogItems.length - 1) {
                        textBox.setText(dialogItem.text + "\n\n" + "End. Click to close.");
                    } else {
                        textBox.setText(dialogItem.text + "\n\n" + "Click to continue...");
                    }
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

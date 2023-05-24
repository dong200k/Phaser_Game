import Phaser from "phaser";
import { ColorStyle, SceneKey } from "../config";
import TextBox from "../UI/TextBox";
import UIPlugins from "phaser3-rex-plugins/templates/ui/ui-plugin";
import UIFactory from "../UI/UIFactory";

export default class RoleScene extends Phaser.Scene {
    
    rexUI!: UIPlugins; 

    constructor() {
        super(SceneKey.RoleScene)
    }

    create() {

        // ------- Scrollable Screen --------
        let scrollablePanel = this.rexUI.add.scrollablePanel({
            x:this.game.scale.width/2,
            y:this.game.scale.height/2 + 44,
            width: this.game.scale.width,
            height: this.game.scale.height - 90,
            panel: {
                child: this.createPanel(),
                mask: {
                    padding: 1,
                }
            },
            scrollMode: "vertical",
            slider: {
                track: this.rexUI.add.roundRectangle(0, 0, 20, 10, 0, ColorStyle.primary.hex[500]),
                thumb: this.rexUI.add.roundRectangle(0, 0, 0, 0, 10, ColorStyle.neutrals.hex[900]),
                adaptThumbSize: true,
            },
            mouseWheelScroller: {
                focus: false,
                speed: 0.2
            },
            space: {
                panel: 5
            }
        })
        scrollablePanel.layout();

    }

    private createPanel() {
        let sizer = this.rexUI.add.sizer({
            orientation: "vertical",
            space: {
                top: 20,
                bottom: 20,
                item: 20,
            }
        })

        // ----- Title ------
        let title = UIFactory.createTextBoxPhaser(this, "Roles", "h3");
        sizer.add(title);

        // ----- Content ------
        let content = this.rexUI.add.fixWidthSizer({
            width: 1058,
            space: {
                top: 50, 
                left: 50,
                bottom: 50,
                right: 50,
                line: 30,
            },
            align: "justify-center"
            
        });
        content.addBackground(this.rexUI.add.roundRectangle(0, 0, 100, 100, 0, ColorStyle.primary.hex[900]));

        for(let i = 0; i < 6; i+=2) {
            content.add(this.createRoleDisplayItem());
            content.add(this.createRoleDisplayItem());
            if(i + 2 < 10) content.addNewLine();
        }

        sizer.add(content);
        sizer.layout();
        return sizer;
    }

    private createRoleDisplayItem() {
        let sizer = this.rexUI.add.fixWidthSizer({
            width: 450, 
            height: 200,
            space: {
                top: 20,
                left: 20,
                bottom: 20,
                right: 20,
                item: 20,
                line: 20
            },
            align: "justify-center"
        })
        sizer.addBackground(this.rexUI.add.roundRectangle(0, 0, 100, 100, 0, ColorStyle.primary.hex[500]));
        sizer.add(this.add.image(0, 0, "").setDisplaySize(128, 128));
        sizer.add(UIFactory.createTextBoxPhaser(this, "The Ranger is a excellent sniper. They possess a unique skill SNIPER which can penetrate multiple enemies.", "p5").setWordWrapWidth(510).setAlign("left"));
        sizer.addNewLine();
        sizer.add(UIFactory.createTextBoxPhaser(this, `1000 Coins`, "h5"));
        return sizer;
    }
}
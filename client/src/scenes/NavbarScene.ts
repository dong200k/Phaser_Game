import Phaser from "phaser";
import { ColorStyle, SceneKey } from "../config";
import Button from "../UI/Button";
import Layout from "../UI/Layout";
import NavButton from "../UI/NavButton";
import TextBox from "../UI/TextBox";

export default class NavbarScene extends Phaser.Scene {
    
    private dummyData = {
        username: "Endsider",
        level: 3,
        coins: 100,
        gems: 3,
    }

    constructor() {
        super(SceneKey.NavbarScene)
    }

    preload() {

    }

    create() {
        let navbarBackground = this.add.rectangle(0, 0, this.game.scale.width, 89, ColorStyle.primary.hex[900]);
        navbarBackground.setOrigin(0, 0);

        //------- Left side of the navbar ---------
        let homeButton = new NavButton(this, "Home", 0, 0, () => console.log("Home nav button clicked"));
        let playButton = new NavButton(this, "Play", 0, 0, () => console.log("Play nav button clicked"));
        let shopButton = new NavButton(this, "Shop", 0, 0, () => console.log("Shop nav button clicked"));
        let skillTreeButton = new NavButton(this, "Skill Tree", 0, 0, () => console.log("Skill Tree nav button clicked"));
        let roleButton = new NavButton(this, "Role", 0, 0, () => console.log("Role nav button clicked"));

        let navButtonLayout = new Layout(this, 0, 0, 0);
        navButtonLayout.setGap(87);
        navButtonLayout.setFlexDirection("row");
        navButtonLayout.setPosition(44, 44);
        navButtonLayout.add([homeButton, playButton, shopButton, skillTreeButton, roleButton]);
        this.add.existing(navButtonLayout);

        //------- Right side of the navbar ---------
        let navRightSideLayout = new Layout(this, 0, 0, 0);
        navRightSideLayout.setGap(100);
        navRightSideLayout.setPosition(this.game.scale.width, 44);
        navRightSideLayout.setFlexDirection("row-reverse");
        
        let logoutButton = new Button(this, "Logout", 0, 0, "small", () => console.log("Logout button onclick"));

        let statLayout = new Layout(this, 20, 0, -40);

        let levelText = new TextBox(this, `Level: ${this.dummyData.level}`, "l4");
        let coinsText = new TextBox(this, `Coins: ${this.dummyData.coins}`, "l4");
        let gemsText = new TextBox(this, `Gems: ${this.dummyData.gems}`, "l4");
        statLayout.add([levelText, coinsText, gemsText]);


        navRightSideLayout.add([statLayout, logoutButton]);
        this.add.existing(navRightSideLayout);
    }

}
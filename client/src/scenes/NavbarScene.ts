import Phaser, { Data } from "phaser";
import { ColorStyle, SceneKey } from "../config";
import Button from "../UI/Button";
import Layout from "../UI/Layout";
import NavButton from "../UI/NavButton";
import TextBox from "../UI/TextBox";
import DataManager from "../system/DataManager";
import SceneManager from "../system/SceneManager";

interface NavbarData {
    activeOn: "home" | "play" | "shop" | "skill tree" | "role";
}

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

        console.log("Navbar created again");

        //------- Left side of the navbar ---------
        let homeButton = new NavButton(this, "Home", 0, 0, () => {
            // console.log("Home nav button clicked");
            DataManager.getDataManager().setData("navbar", {activeOn: "home"});
            SceneManager.getSceneManager().switchToScene("MenuScene");
        });
        let playButton = new NavButton(this, "Play", 0, 0, () => {
            // console.log("Play nav button clicked") 
            DataManager.getDataManager().setData("navbar", {activeOn: "play"});
            SceneManager.getSceneManager().switchToScene("GameModeScene");
        });
        let shopButton = new NavButton(this, "Shop", 0, 0, () => {
            console.log("Shop nav button clicked")
            DataManager.getDataManager().setData("navbar", {activeOn: "shop"});
            SceneManager.getSceneManager().switchToScene("ShopScene");
        });
        let skillTreeButton = new NavButton(this, "Skill Tree", 0, 0, () => {
            console.log("Skill Tree nav button clicked")
            DataManager.getDataManager().setData("navbar", {activeOn: "skill tree"});
            SceneManager.getSceneManager().switchToScene("SkillTreeScene");
        });
        let roleButton = new NavButton(this, "Role", 0, 0, () => {
            console.log("Role nav button clicked")
            DataManager.getDataManager().setData("navbar", {activeOn: "role"});
            SceneManager.getSceneManager().switchToScene("RoleScene");
        });

        const clearNavbuttons = () => {
            homeButton.setButtonActive(false);
            playButton.setButtonActive(false);
            shopButton.setButtonActive(false);
            skillTreeButton.setButtonActive(false);
            roleButton.setButtonActive(false);
        }

        let dataManager = DataManager.getDataManager();
        dataManager.addListener("navbar", (navbarData: NavbarData) => {
            if(navbarData.activeOn) {
                switch(navbarData.activeOn) {
                    case 'home': {
                        clearNavbuttons();
                        homeButton.setButtonActive(true);
                    } break;
                    case 'play': {
                        clearNavbuttons();
                        playButton.setButtonActive(true);
                    } break;
                    case 'shop': {
                        clearNavbuttons();
                        shopButton.setButtonActive(true);
                    } break;
                    case 'skill tree': {
                        clearNavbuttons();
                        skillTreeButton.setButtonActive(true);
                    } break;
                    case 'role': {
                        clearNavbuttons();
                        roleButton.setButtonActive(true);
                    } break;
                }
            }
        })

        let navButtonLayout = new Layout(this, 0, 0, 0);
        navButtonLayout.setFlexDirection("row");
        navButtonLayout.setPosition(44, 44);
        navButtonLayout.add([homeButton, playButton, shopButton, skillTreeButton, roleButton]);
        this.add.existing(navButtonLayout);

        //------- Right side of the navbar ---------
        // let navRightSideLayout = new Layout(this, 0, 0, 0);
        // navRightSideLayout.setGap(100);
        // navRightSideLayout.setPosition(this.game.scale.width, 44);
        // navRightSideLayout.setFlexDirection("row-reverse");
        
        let logoutButton = new Button(this, "Logout", this.game.scale.width - 80, 46, "small", () => console.log("Logout button onclick"));
        this.add.existing(logoutButton);

        let statLayout = new Layout(this, 0, this.game.scale.width - 200, 22);
        let levelText = new TextBox(this, `Level: ${this.dummyData.level}`, "l4");
        let coinsText = new TextBox(this, `Coins: ${this.dummyData.coins}`, "l4");
        let gemsText = new TextBox(this, `Gems: ${this.dummyData.gems}`, "l4");
        statLayout.add([levelText, coinsText, gemsText]);
        statLayout.setAlignItems('start');
        this.add.existing(statLayout);



        // navRightSideLayout.add([statLayout, logoutButton]);
        // this.add.existing(navRightSideLayout);
    }

}
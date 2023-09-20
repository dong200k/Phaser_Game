import Phaser, { Data } from "phaser";
import { ColorStyle, SceneKey } from "../config";
import Button from "../UI/Button";
import Layout from "../UI/Layout";
import NavButton from "../UI/NavButton";
import TextBox from "../UI/TextBox";
import DataManager from "../system/DataManager";
import SceneManager from "../system/SceneManager";
import EventManager from "../system/EventManager";
import ClientFirebaseConnection from "../firebase/ClientFirebaseConnection";
import UIPlugins from "phaser3-rex-plugins/templates/ui/ui-plugin";
import UIFactory from "../UI/UIFactory";
import TextBoxRex from "../UI/TextBoxRex";
import { Sizer } from "phaser3-rex-plugins/templates/ui/ui-components";

interface NavbarData {
    activeOn: "home" | "play" | "shop" | "skill tree" | "role";
    username: string;
    level: number; 
    coins: number;
    gems: number;
}

export default class NavbarScene extends Phaser.Scene {
    
    private navbarData: NavbarData = {
        activeOn: "home",
        username: "Offline",
        level: 3,
        coins: 100,
        gems: 3,
    }

    // Plugin for UI elements that will be injected at scene creation.
    rexUI!: UIPlugins;

    private userNameText!: TextBox;

    /** Displays level, coins, and gems. */
    private infoDisplay!: Sizer;

    private statLayout!: Layout;

    constructor() {
        super(SceneKey.NavbarScene)
    }

    preload() {

    }

    create() {
        this.initializeUI();
        this.initializeListeners();
    }

    

    private initializeListeners() {
        EventManager.eventEmitter.on(EventManager.NavbarEvents.UPDATE_NAVBAR, this.updateNavbar, this);
        this.events.once("shutdown", () => this.removeListeners());
        this.events.on("wake", () => this.updateNavbar({}));
    }

    private removeListeners() {
        EventManager.eventEmitter.off(EventManager.NavbarEvents.UPDATE_NAVBAR, this.updateNavbar, this);
    }

    private initializeUI() {
        let navbarBackground = this.add.rectangle(0, 0, this.game.scale.width, 89, ColorStyle.primary.hex[900]);
        navbarBackground.setOrigin(0, 0);

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
            DataManager.getDataManager().setData("navbar", {activeOn: "shop"});
            SceneManager.getSceneManager().switchToScene("ShopScene");
        });
        let skillTreeButton = new NavButton(this, "Skill Tree", 0, 0, () => {
            DataManager.getDataManager().setData("navbar", {activeOn: "skill tree"});
            SceneManager.getSceneManager().switchToScene("SkillTreeScene");
        });
        let roleButton = new NavButton(this, "Role", 0, 0, () => {
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

        let navButtonLayout = new Layout(this, {
            flexDirection:'row',
        });
        navButtonLayout.add([homeButton, playButton, shopButton, skillTreeButton, roleButton]);
        navButtonLayout.setOrigin(0, 0);
        this.add.existing(navButtonLayout);

        //------- Right side of the navbar ---------
        let navRightSideLayout = new Layout(this, {
            x:this.game.scale.width - 38,
            y:44,
            gap: 78, 
            flexDirection: 'row',
            originX: 1, 
            originY: 0.5,
        });
        
        let logoutButton = new Button(this, "Logout", 0, 0, "small", () => {
            ClientFirebaseConnection.getConnection().logout();
                // .then(()=>{
                //     SceneManager.getSceneManager().switchToScene(SceneKey.LoginScene)
                // })
        });
        this.userNameText = new TextBox(this, `${this.navbarData.username}`, 'l4');
        let logoutLayout = new Layout(this, {
            gap: 5,
            flexDirection: 'col',
        });
        logoutLayout.add([this.userNameText, logoutButton]);

        
        this.infoDisplay = this.createInfoDisplay();

        navRightSideLayout.add([logoutLayout]);
        this.add.existing(navRightSideLayout);

        // Listen for player data changes
        let initPlayerData = (playerData: any)=>{
            let navbarData: NavbarData = {
                activeOn: "home",
                username: playerData?.username,
                level: playerData?.level,
                coins: playerData?.coins,
                gems: playerData?.gems,
            }
    
            this.updateNavbar(navbarData)
        }
        ClientFirebaseConnection.getConnection().addPlayerDataListener("navbar", initPlayerData)  

        // init player data
        initPlayerData(ClientFirebaseConnection.getConnection().playerData)

        this.updateNavbar({});
    }

    public updateNavbar(data: Partial<NavbarData>) {
        Object.assign(this.navbarData, data);
        this.userNameText.setText(this.navbarData.username);
        (this.infoDisplay.getByName("LevelText", true) as TextBoxRex).setText(`Level: ${this.navbarData.level}`);
        (this.infoDisplay.getByName("CoinsText", true) as TextBoxRex).setText(`Coins: ${this.navbarData.coins}`);
        (this.infoDisplay.getByName("GemsText", true) as TextBoxRex).setText(`Gems: ${this.navbarData.gems}`);
        this.infoDisplay.layout();
    }

    /** Create the info display that shows the level, coins, and gems. */
    private createInfoDisplay() {
        let sizer = this.rexUI.add.sizer({
            orientation: "vertical",
            anchor: {
                top: "top+15",
                right: "right-200",
            }
        });

        sizer.add(UIFactory.createTextBoxRex(this, "Level: 1", "l4").setName("LevelText"), {expand:false, align:"left"});
        sizer.add(UIFactory.createTextBoxRex(this, "Coins: 0", "l4").setName("CoinsText"), {expand:false, align:"left"});
        sizer.add(UIFactory.createTextBoxRex(this, "Gems: 0", "l4").setName("GemsText"), {expand:false, align:"left"});

        return sizer;
    }
}
import Phaser from 'phaser';
import GameScene from './scenes/GameScene';
import LobbyScene from './scenes/LobbyScene';
import MenuScene from './scenes/MenuScene';
import RoomScene from './scenes/RoomScene';
import SettingsScene from './scenes/SettingsScene';
import ControlsScene from './scenes/ControlsScene';
import CreditsScene from './scenes/CreditsScene';
import LoginScene from './scenes/LoginScene';
import SignupScene from './scenes/SignupScene';
import ShopScene from './scenes/ShopScene';
import SkillTreeScene from './scenes/SkillTreeScene';
import RoleScene from './scenes/RoleScene';
import GameModeScene from './scenes/GameModeScene';
import JoinWithIDScene from './scenes/JoinWithIDScene';
import HostGameScene from './scenes/HostGameScene';
import LoadingScene from './scenes/LoadingScene';
import NavbarScene from './scenes/NavbarScene';
import MatchmakeScene from './scenes/MatchmakeScene';
import SystemPreloadScene from './scenes/SystemPreloadScene';

export default {
    type: Phaser.AUTO,
    parent: 'game',
    backgroundColor: `#736B64`,
    // pixelArt: true,
    scale: {
        width: 1280,
        height: 800,
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    physics: {
        default: 'matter',
        matter: {
            gravity: {
                y: 0,
            },
            debug: true
        }
    },
    dom: {
        createContainer: true
    },
    //----- IMPORTANT ------ SystemPreloadScene should always be the first scene. Use StartScene const below to set starting scene.
    scene: [SystemPreloadScene, MenuScene, GameScene, LobbyScene, RoomScene, SettingsScene, ControlsScene, CreditsScene,
            LoginScene, SignupScene, ShopScene, SkillTreeScene, RoleScene, GameModeScene,
            JoinWithIDScene, HostGameScene, LoadingScene, NavbarScene, MatchmakeScene],
    // resolution: window.devicePixelRatio,
    // antialias: false,
    gameTitle: 'Dungeon and Adventurers',
    gameVersion: 'v0.01',
};

export enum SceneKey {
    GameScene = "GameScene",
    LobbyScene = "LobbyScene",
    MenuScene = "MenuScene",
    RoomScene = "RoomScene",
    SettingsScene = "SettingsScene",
    ControlsScene = "ControlsScene",
    CreditsScene = "CreditsScene",
    LoginScene = "LoginScene",
    SignupScene = "SignupScene",
    ShopScene = "ShopScene",
    SkillTreeScene = "SkillTreeScene",
    RoleScene = "RoleScene",
    GameModeScene = "GameModeScene",
    JoinWithIDScene = "JoinWithIDScene",
    HostGameScene = "HostGameScene",
    LoadingScene = "LoadingScene",
    NavbarScene = "NavbarScene",
    MatchmakeScene = "MatchmakeScene",
    SystemPreloadScene = "SystemPreloadScene"
}
export type SceneKeyType = keyof typeof SceneKey;

/** ------------ Change the scene key here to set the starting scene. ---------------*/
export const StartScene = SceneKey.MenuScene;

const headerFontFamily = 'pressStart2P';
const bodyFontFamily = 'aldrich';
/**Some predefined typestyles to be used with Phaser*/
export const TextStyle = {
    h1: {
        fontFamily: headerFontFamily,
        fontSize: '40px',
    },
    h2: {
        fontFamily: headerFontFamily,
        fontSize: '32px',
    },
    h3: {
        fontFamily: headerFontFamily,
        fontSize: '24px',
    },
    h4: {
        fontFamily: headerFontFamily,
        fontSize: '20px',
    },
    h5: {
        fontFamily: headerFontFamily,
        fontSize: '16px',
    },
    p1: {
        fontFamily: bodyFontFamily,
        fontSize: '32px',
    },
    p2: {
        fontFamily: bodyFontFamily,
        fontSize: '24px',
    },
    p3: {
        fontFamily: bodyFontFamily,
        fontSize: '20px',
    },
    p4: {
        fontFamily: bodyFontFamily,
        fontSize: '16px',
    },
    p5: {
        fontFamily: bodyFontFamily,
        fontSize: '14px',
    },
    p6: {
        fontFamily: bodyFontFamily,
        fontSize: '12px',
    },
    l1: {
        fontFamily: bodyFontFamily,
        fontSize: '32px',
    },
    l2: {
        fontFamily: bodyFontFamily,
        fontSize: '24px',
    },
    l3: {
        fontFamily: bodyFontFamily,
        fontSize: '20px',
    },
    l4: {
        fontFamily: bodyFontFamily,
        fontSize: '16px',
    },
    l5: {
        fontFamily: bodyFontFamily,
        fontSize: '14px',
    },
    l6: {
        fontFamily: bodyFontFamily,
        fontSize: '12px',
    },
}

export const ColorStyle = {
    neutrals: {
        900: "#0F0E0D",
        800: "#201F1E",
        700: "#353432",
        600: "#4B4948",
        500: "#615E5C",
        400: "#83807E",
        300: "#9F9C9A",
        200: "#B6B4B3",
        100: "#D8D7D6",
        white: "#F0EFEE",
        hex: {
            900: 0x0F0E0D,
            800: 0x201F1E,
            700: 0x353432,
            600: 0x4B4948,
            500: 0x615E5C,
            400: 0x83807E,
            300: 0x9F9C9A,
            200: 0xB6B4B3,
            100: 0xD8D7D6,
            white: 0xF0EFEE,
        }
    }, 
    primary: {
        900: "#2F2B28",
        500: "#4C4540",
        100: "#736B64",
        hex: {
            900: 0x2F2B28,
            500: 0x4C4540,
            100: 0x736B64,
        }
    },
    red: {
        900: "#A21212",
        500: "#CD3737",
        100: "#E77162",
        hex: {
            900: 0xA21212,
            500: 0xCD3737,
            100: 0xE77162,
        }
    }
}
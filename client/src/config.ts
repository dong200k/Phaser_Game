import Phaser from 'phaser';

export default {
    type: Phaser.AUTO,
    parent: 'game',
    backgroundColor: `#333333`,
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
    // resolution: window.devicePixelRatio,
    antialias: false,
};

/**Some predefined typestyles to be used with Phaser*/
export const TextStyle = {
    h1: {
        fontFamily: 'pressStart2P',
        fontSize: '40px',
    },
    h2: {
        fontFamily: 'pressStart2P',
        fontSize: '32px',
    },
    h3: {
        fontFamily: 'pressStart2P',
        fontSize: '24px',
    },
    h4: {
        fontFamily: 'pressStart2P',
        fontSize: '20px',
    },
    h5: {
        fontFamily: 'pressStart2P',
        fontSize: '16px',
    },
    p1: {
        fontFamily: 'aldrich',
        fontSize: '32px',
    },
    p2: {
        fontFamily: 'aldrich',
        fontSize: '24px',
    },
    p3: {
        fontFamily: 'aldrich',
        fontSize: '20px',
    },
    p4: {
        fontFamily: 'aldrich',
        fontSize: '16px',
    },
    p5: {
        fontFamily: 'aldrich',
        fontSize: '14px',
    },
    p6: {
        fontFamily: 'aldrich',
        fontSize: '12px',
    },
    l1: {
        fontFamily: 'aldrich',
        fontSize: '32px',
    },
    l2: {
        fontFamily: 'aldrich',
        fontSize: '24px',
    },
    l3: {
        fontFamily: 'aldrich',
        fontSize: '20px',
    },
    l4: {
        fontFamily: 'aldrich',
        fontSize: '16px',
    },
    l5: {
        fontFamily: 'aldrich',
        fontSize: '14px',
    },
    l6: {
        fontFamily: 'aldrich',
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
    }
}
import { TextStyle } from "../config";

type Rect = {
    x: number,
    y: number,
    width: number,
    height: number,
    color: number
}

const NavButton = (scene: Phaser.Scene, text: string, on: () => void, textPos: {x: number, y: number}, rect?: Rect, setInteractive = true)=>{
    let button: Phaser.GameObjects.Rectangle | Phaser.GameObjects.Text = scene.add.text(textPos.x, textPos.y, text, TextStyle.p4);
    button.setDepth(1) // renders text over button which has depth of default 0

    if(rect) button = scene.add.rectangle(rect.x, rect.y, rect.width, rect.height, rect.color)

    button.setInteractive()
    button.on(Phaser.Input.Events.POINTER_UP, on, scene);
}

export default NavButton
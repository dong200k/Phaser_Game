import Phaser from "phaser";

export default class Button extends Phaser.GameObjects.Container {
    
    constructor(scene:Phaser.Scene,text:string="",x:number=0,y:number=0,onClick:Function=()=>{}) {
        super(scene);
        this.setState("default");
    }

    private setButtonState(state:"default"|"disabled"|"pressed") {
        this.state = state;
    }

    public setButtonActive(buttonActive:boolean) {
        if(buttonActive)
            this.setButtonState("default");
        else
            this.setButtonState("disabled");
    }
}
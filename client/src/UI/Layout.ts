import Layoutable from "./Layoutable";

type FlexDirectionType = 'row'|'col'|'row-reverse'|'col-reverse';

export default class Layout extends Phaser.GameObjects.Container implements Layoutable {
    
    layoutWidth:number;
    layoutHeight:number;
    parentLayout:Layout | null = null;
    private flexDirection:FlexDirectionType = 'col';
    private gap: number;
    //private justifyContent:'flexStart'|'flexEnd'|'space-between'='flexStart'; 

    constructor(scene:Phaser.Scene, gap=100, x=0, y=0) {
        super(scene,x,y);
        this.gap=gap;
        this.layoutWidth = 0;
        this.layoutHeight = 0;
        this.updateLayoutDisplay();
    }

    private updateLayoutDisplay() {
        let childrens = this.getAll();
        let x = 0;
        let y = 0;
        childrens.forEach((child:any, idx) => {
            try {
                child.setPosition(x, y);
            } catch(e) {
                console.log(e);
            }
            switch(this.flexDirection) {
                case 'col': y += this.gap; break;
                case 'col-reverse': y-= this.gap; break;
                case 'row': x+= this.gap; break;
                case 'row-reverse': x-= this.gap; 
            }
        })
    }

    // public setJustifyContent(justifyContent:'flexStart'|'flexEnd'|'space-between') {
    //     this.justifyContent = justifyContent;
    //     this.updateLayoutDisplay();
    // }

    /**
     * Sets the direction the game objects should be layed out in. row means horizontally and col mean vertially.
     * @param flexDirection - row or col.
     */
    public setFlexDirection(flexDirection:FlexDirectionType) {
        this.flexDirection = flexDirection;
        this.updateLayoutDisplay();
    }

    /**
     * Sets the gap between each element.
     * @param gap gap in px.
     */
    public setGap(gap:number) {
        this.gap = gap;
        this.updateLayoutDisplay();
    }

    public add(child: Phaser.GameObjects.GameObject|Phaser.GameObjects.GameObject[]): this {
        super.add(child);
        try { //WARNING: bad typescript practice.
            if(child.hasOwnProperty("parentLayout")) {
                (child as any).parentLayout = this;
            }
        } catch (e) {
            console.log(e);
        }
        this.recalculateDimensions();
        this.updateLayoutDisplay();
        return this;
    }

    public recalculateDimensions() {
        this.layoutWidth = 0;
        this.layoutHeight = 0;
        this.getAll().forEach((item:any) => {
            this.layoutWidth += item.layoutWidth;
            this.layoutHeight += item.layoutHeight;
        })
        this.parentLayout?.recalculateDimensions();
    }
}
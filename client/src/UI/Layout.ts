import Layoutable from "./Layoutable";

type FlexDirectionType = 'row'|'col'|'row-reverse'|'col-reverse';

export default class Layout extends Phaser.GameObjects.Container implements Layoutable {
    
    layoutWidth:number;
    layoutHeight:number;
    parentLayout:Layout | null = null;
    private flexDirection:FlexDirectionType = 'col';
    private gap: number;
    //private justifyContent:'flexStart'|'flexEnd'|'space-between'='flexStart';

    private layoutChildren: Layoutable[] = [];

    constructor(scene:Phaser.Scene, gap=100, x=0, y=0) {
        super(scene,x,y);
        this.gap=gap;
        this.layoutWidth = 0;
        this.layoutHeight = 0;
        this.updateLayoutDisplay();
    }

    private updateLayoutDisplay() {
        let children = this.layoutChildren;
        let x = 0;
        let y = 0;
        children.forEach((child, idx) => {
            child.setLayoutPosition(x, y);
            switch(this.flexDirection) {
                case 'col': y += this.gap+child.getLayoutHeight(); break;
                case 'col-reverse': y-= this.gap+child.getLayoutHeight(); break;
                case 'row': x+= this.gap+child.getLayoutWidth(); break;
                case 'row-reverse': x-= this.gap+child.getLayoutWidth(); 
            }
        })
    }

    public setLayoutPosition(x: number, y: number) {
        this.setPosition(x, y);
    }

    public getLayoutWidth(): number {
        return this.layoutWidth;
    }

    public getLayoutHeight(): number {
        return this.layoutHeight;
    }

    public getLayoutOriginX(): number {
        return 0;
    }

    public getLayoutOriginY(): number {
        return 0;
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

    /**
     * Adds the given Game Object, or array of Game Objects, to this Container. The Game Object is now layoutable.
     * Each Game Object must be unique within the Container.
     * @param child Takes in a child that is both a Phaser Game Object and implements layoutable.
     */
    public add(child: (Phaser.GameObjects.GameObject&Layoutable)|(Phaser.GameObjects.GameObject[]&Layoutable[])): this {
        super.add(child);
        this.addLayout(child);
        this.recalculateDimensions();
        this.updateLayoutDisplay();
        return this;
    }

    private addLayout(child: Layoutable|Layoutable[]) {
        if(Array.isArray(child)) 
            this.layoutChildren.push(...child);
        else
            this.layoutChildren.push(child);
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
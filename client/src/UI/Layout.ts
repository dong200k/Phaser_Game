
export default class Layout extends Phaser.GameObjects.Container {
    private flexDirection:'row'|'col' = 'col';
    private gap: number;
    //private justifyContent:'flexStart'|'flexEnd'|'space-between'='flexStart';
    

    constructor(scene:Phaser.Scene, gap=100, x=0, y=0) {
        super(scene,x,y);
        this.gap=gap;
        this.updateLayoutDisplay();
    }

    private updateLayoutDisplay() {
        let childrens = this.getAll();
        let x = 0;
        let y = 0;
        childrens.forEach((child:any, idx) => {
            console.log(`x: ${x} y: ${y}`);
            try {
                child.setPosition(x, y);
            } catch(e) {
                console.log(e);
            }
            if(this.flexDirection==='row') 
                x += this.gap;
            else 
                y += this.gap;
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
    public setFlexDirection(flexDirection:'row'|'col') {
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
        this.updateLayoutDisplay();
        return this;
    }
}
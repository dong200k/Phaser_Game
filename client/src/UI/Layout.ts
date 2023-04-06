import Layoutable from "./Layoutable";

type FlexDirectionType = 'row'|'col'|'row-reverse'|'col-reverse';
type AlignItemsType = 'start'|'end'|'center';

export default class Layout extends Phaser.GameObjects.Container implements Layoutable {
    parentLayout:Layout | null = null;
    private flexDirection:FlexDirectionType = 'col';
    private gap: number;
    private alignItems: AlignItemsType = 'center';

    private layoutChildren: Layoutable[] = [];

    constructor(scene:Phaser.Scene, gap=100, x=0, y=0) {
        super(scene,x,y);
        this.gap=gap;
        this.updateLayoutDisplay();
    }

    private updateLayoutDisplay() {
        let children = this.layoutChildren;
        let x = 0;
        let y = 0;
        for(let i = 0; i < children.length; i++) {
            let child1 = children[i];
            //calculate align item
            if(this.flexDirection === 'col' || this.flexDirection === 'col-reverse') {
                let maxHalfWidth = this.getLayoutWidth() / 2;
                let childHalfWidth = child1.getLayoutWidth() / 2;
                let shiftDistance = Math.abs(maxHalfWidth - childHalfWidth);
                if(this.alignItems === 'start') {
                    x = -shiftDistance;
                } else if(this.alignItems === 'end') {
                    x = shiftDistance;
                } else {
                    x = 0;
                }
            } else {
                let maxHalfHeight = this.getLayoutHeight() / 2;
                let childHalfHeight = child1.getLayoutHeight() / 2;
                let shiftDistance = Math.abs(maxHalfHeight - childHalfHeight);
                if(this.alignItems === 'start') {
                    y = -shiftDistance;
                } else if(this.alignItems === 'end') {
                    y = shiftDistance;
                } else {
                    y = 0;
                }
            }

            child1.setLayoutPosition(x, y);
            if(children.length > i+1) {
                let child2 = children[i+1];
                //calculate gap between two child
                switch(this.flexDirection) {
                    case 'col': { // child1.height * (1 - child1.originY) + child2.height * child2.originY;
                        let gapBetween = child1.getLayoutHeight() * (1 - child1.getLayoutOriginY()) + child2.getLayoutHeight() * child2.getLayoutOriginY();
                        y += this.gap+gapBetween;
                    } break;
                    case 'col-reverse': {
                        let gapBetween = child1.getLayoutHeight() * child1.getLayoutOriginY() + child2.getLayoutHeight() * (1 - child2.getLayoutOriginY());
                        y-= this.gap+gapBetween;
                    } break;
                    case 'row': {
                        let gapBetween = child1.getLayoutWidth() * (1 - child1.getLayoutOriginX()) + child2.getLayoutWidth() * child2.getLayoutOriginX();
                        x+= this.gap+gapBetween;
                    } break;
                    case 'row-reverse': {
                        let gapBetween = child1.getLayoutWidth() * child1.getLayoutOriginX() + child2.getLayoutWidth() * (1 - child2.getLayoutOriginX());
                        x-= this.gap+gapBetween;
                    } 
                }
            }
        }
    }

    public setLayoutPosition(x: number, y: number) {
        this.setPosition(x, y);
    }

    public getLayoutWidth(): number {
        let width = 0;
        // If the flexDirection is row or row-reverse the width is equal to all the children width plus the gap between them.
        if(this.flexDirection === 'row' || this.flexDirection === 'row-reverse') {
            this.layoutChildren.forEach((child) => width += child.getLayoutWidth());
            width += this.gap * (this.layoutChildren.length - 1);
        } else {
            this.layoutChildren.forEach((child) => {
                width = Math.max(child.getLayoutWidth(), width);
            })
        }
        return width;
    }

    public getLayoutHeight(): number {
        let height = 0;
        // If the flexDirection is col or col-reverse the height is equal to all the children height plus the gap between them.
        if(this.flexDirection === 'col' || this.flexDirection === 'col-reverse') {
            this.layoutChildren.forEach((child) => height += child.getLayoutHeight());
            height += this.gap * (this.layoutChildren.length - 1);
        } else {
            this.layoutChildren.forEach((child) => {
                height = Math.max(child.getLayoutHeight(), height);
            })
        }
        return height;
    }

    public getLayoutOriginX(): number {
        return 0;
    }

    public getLayoutOriginY(): number {
        return 0;
    }

    /**
     * Sets the direction the game objects should be layed out in. row means horizontally and col mean vertially.
     * @param flexDirection - row or col.
     */
    public setFlexDirection(flexDirection:FlexDirectionType) {
        this.flexDirection = flexDirection;
        this.updateLayoutDisplay();
    }

    /**
     * Aligns the items in the layout as either start, end, or center.
     * @param alignItems alignItems value (start, end, center).
     */
    public setAlignItems(alignItems:AlignItemsType) {
        this.alignItems = alignItems;
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
     * Each Game Object must be unique within the Container. For proper layout make sure the origin of the game objects are (0.5,0.5).
     * @param child Takes in a child that is both a Phaser Game Object and implements layoutable.
     */
    public add(child: (Phaser.GameObjects.GameObject&Layoutable)|(Phaser.GameObjects.GameObject[]&Layoutable[])): this {
        super.add(child);
        this.addLayout(child);
        this.updateLayoutDisplay();
        return this;
    }

    private addLayout(child: Layoutable|Layoutable[]) {
        if(Array.isArray(child)) 
            this.layoutChildren.push(...child);
        else
            this.layoutChildren.push(child);
    }
}
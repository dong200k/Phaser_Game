import Layoutable from "./Layoutable";

type FlexDirectionType = 'row'|'col'|'row-reverse'|'col-reverse';
type AlignItemsType = 'start'|'end'|'center';

interface LayoutConfig {
    gap?:number;
    flexDirection?:FlexDirectionType;
    alignItems?:AlignItemsType;
    originX?:number;
    originY?:number;
}

export default class Layout extends Phaser.GameObjects.Container implements Layoutable {
    private flexDirection:FlexDirectionType = 'col';
    private gap: number = 0;
    private alignItems: AlignItemsType = 'center';
    private layoutOriginX: number = 0.5;
    private layoutOriginY: number = 0.5;

    private layoutChildren: Layoutable[] = [];
    

    /**
     * Creates a new Layout that is used to group and position Layoutable objects.
     * @param scene The phaser scene this layout will belong to.
     * @param x The x position.
     * @param y The y position.
     * @param layoutConfig 
     */
    constructor(scene:Phaser.Scene, x=0, y=0, layoutConfig?:LayoutConfig) {
        super(scene,x,y);
        if(layoutConfig) {
            if(layoutConfig.gap !== undefined) this.gap = layoutConfig.gap;
            if(layoutConfig.alignItems !== undefined) this.alignItems = layoutConfig.alignItems;
            if(layoutConfig.flexDirection !== undefined) this.flexDirection = layoutConfig.flexDirection;
            if(layoutConfig.originX !== undefined) this.layoutOriginX = layoutConfig.originX;
            if(layoutConfig.originY !== undefined) this.layoutOriginY = layoutConfig.originY;
        }
        this.updateLayoutDisplay();
    }

    /** Position each of the layout's children according to the layout's origin, flexdirection, and alignitems. */
    private updateLayoutDisplay() {
        let children = this.layoutChildren;
        let width = this.getLayoutWidth();
        let height = this.getLayoutHeight();
        let originX = this.getLayoutOriginX();
        let originY = this.getLayoutOriginY();
        let x = 0;
        let y = 0;

        switch(this.flexDirection) {
            case 'row': { 
                //We will start x and y at the top left of the layout. And layout the children from left to right.
                x = -(width * originX);
                y = -(height * originY);
                for(let i = 0; i < children.length; i++) { 
                    let child = children[i];
                    let childWidth = child.getLayoutWidth();
                    let childY = this.alignHelper(height, y, child.getLayoutHeight(), child.getLayoutOriginY(), this.alignItems);
                    let childX = x + (child.getLayoutOriginX() * childWidth);
                    child.setLayoutPosition(childX, childY);
                    x += childWidth + this.gap;
                }
            } break;
            case 'row-reverse': {
                //We will start x and y at the top right of the layout. And layout the children from right to left.
                x = width * (1 - originX);
                y = -(height * originY);
                for(let i = 0; i < children.length; i++) {
                    let child = children[i];
                    let childWidth = child.getLayoutWidth();
                    let childY = this.alignHelper(height, y, child.getLayoutHeight(), child.getLayoutOriginY(), this.alignItems);
                    let childX = x - ((1 - child.getLayoutOriginX()) * childWidth);
                    child.setLayoutPosition(childX, childY);
                    x -= childWidth + this.gap;
                }
            } break;
            case 'col': {
                //We will start x and y at the top left of the layout. And layout the children from top to bottom.
                x = -(width * originX);
                y = -(height * originY);
                for(let i = 0; i < children.length; i++) { 
                    let child = children[i];
                    let childHeight = child.getLayoutHeight();
                    let childX = this.alignHelper(width, x, child.getLayoutWidth(), child.getLayoutOriginX(), this.alignItems);
                    let childY = y + (child.getLayoutOriginY() * childHeight);
                    child.setLayoutPosition(childX, childY);
                    y += childHeight + this.gap;
                }
            } break;
            case 'col-reverse': {
                //We will start x and y at the bottom left of the layout. And layout the children from bottom to top.
                x = -(width * originX);
                y = height * (1 - originY);
                for(let i = 0; i < children.length; i++) {
                    let child = children[i];
                    let childHeight = child.getLayoutHeight();
                    let childX = this.alignHelper(width, x, child.getLayoutWidth(), child.getLayoutOriginX(), this.alignItems);
                    let childY = y - ((1 - child.getLayoutOriginY()) * childHeight);
                    child.setLayoutPosition(childX, childY);
                    y -= childHeight + this.gap;
                }
            }
        }
    }

    /** Align helper determines the offset position from the start the child will be placed so that it is aligned properly in the layout. */
    private alignHelper(layoutLength:number, startPosition:number, childLength:number, childOrigin: number, align: AlignItemsType) {
        //We will start with the child's origin aligned with the startPosition.
        let offset = startPosition;
        switch(align) {
            case 'start': {
                //For align = 'start' we will use the child's orign and child's length to align the child's starting edge with the layout's starting edge.
                offset += childLength * childOrigin;
            } break;
            case 'center': {
                //For align = 'center' we want to center the child in the middle of the layout. We will keep the child's origin into account.
                offset += layoutLength / 2 + ((childOrigin - 0.5) * childLength);
            } break;
            case 'end': {
                //For align = 'end' we will align the child's ending edge with the layout's ending edge.
                offset += layoutLength - (childLength * (1 - childOrigin));
            } break;
        }
        return offset;
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

    /** Gets the layout origin x of this Layout. */
    public getLayoutOriginX(): number {
        return this.layoutOriginX;
    }

    public getLayoutOriginY(): number {
        return this.layoutOriginY;
    }

    /** Sets the origin of this Layout object. This will determine how this Layout will be positioned.
     * @param x The x origin, a value between 0 and 1.
     * @param y The y origin, a value between 0 and 1.
     */
    public setOrigin(x=0, y=0) {
        this.layoutOriginX = x;
        this.layoutOriginY = y;
        if(x < 0) this.layoutOriginX = 0;
        if(x > 1) this.layoutOriginX = 1;
        if(y < 0) this.layoutOriginY = 0;
        if(y > 1) this.layoutOriginY = 1;
        this.updateLayoutDisplay();
    }

    /**
     * @returns All the layoutable children of this Layout
     */
    public getLayoutChildren() {
        return this.layoutChildren;
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
     * Each Game Object must be unique within the Container.
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
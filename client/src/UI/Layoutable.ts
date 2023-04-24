
export default interface Layoutable {
    setLayoutPosition: (x:number, y:number) => void;
    getLayoutWidth: () => number;
    getLayoutHeight: () => number;
    getLayoutOriginX: () => number;
    getLayoutOriginY: () => number;
    // I need to be able to figure out the width and height of layout items so i can center them. 
    // I also need to be able to update the parent element a layout is in so i can update their width.
}

/**
 * Bake a border graphics into the provided graphics object based on the layoutable object. 
 * Any previous graphics will be cleared by calling the graphics' clear() method. 
 * All graphics will be drawn with (x, y) at (0, 0) and based on the layout's originX, originY, width, and height.
 * 
 * @param layoutItem 
 * @param graphics 
 */
export const bakeBorderGraphicsFromLayout = (layoutItem: Layoutable, graphics: Phaser.GameObjects.Graphics, color = 0x00000) => {
    graphics.clear();
    let originX = layoutItem.getLayoutOriginX();
    let originY = layoutItem.getLayoutOriginY();
    let width = layoutItem.getLayoutWidth();
    let height = layoutItem.getLayoutHeight();
    let topLeft = {
        x: -width * originX,
        y: -height * originY,
    }
    graphics.lineStyle(1, color, 0.9);
    graphics.strokeRect(topLeft.x, topLeft.y, width, height);
}

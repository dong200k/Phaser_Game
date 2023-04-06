
export default interface Layoutable {
    setLayoutPosition: (x:number, y:number) => void;
    getLayoutWidth: () => number;
    getLayoutHeight: () => number;
    getLayoutOriginX: () => number;
    getLayoutOriginY: () => number;
    // I need to be able to figure out the width and height of layout items so i can center them. 
    // I also need to be able to update the parent element a layout is in so i can update their width.
}
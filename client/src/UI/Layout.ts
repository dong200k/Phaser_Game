
export default class Layout extends Phaser.GameObjects.Container {
    /**
     * Layout should have 
     * flex-direction: row, col
     * justify-content: flex-start, flex-end, space-between
     * gap: gap between items
     */
    private flexDirection:'row'|'col' = 'col';
    private justifyContent:'flexStart'|'flexEnd'|'space-between'='flexStart';
    

    constructor(scene:Phaser.Scene, x=0, y=0) {
        super(scene,x,y);
    }
}
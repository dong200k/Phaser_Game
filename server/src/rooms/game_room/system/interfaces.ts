

// ------------ interfaces for the Tiled json file -------------- //
interface TiledObjectJSON {
    height: number;
    id: number;
    name: string;
    point: boolean;
    rotation: number;
    type: string;
    visible: boolean;
    width: number;
    x: number;
    y: number;
}

interface TiledLayerJSON {
    data: number[];
    height: number;
    id: number;
    name: string;
    opacity: number;
    type: string;
    visible: boolean;
    width: number;
    x: number;
    y: number;
    draworder: boolean;
    objects: TiledObjectJSON[];
}

export interface TiledJSON {
    compressionLevel: number;
    editorsettings: any;
    height: number;
    infinite: boolean;
    layers: TiledLayerJSON[];
    nextlayerid: number;
    nextobjectid: number;
    orientation: string;
    renderorder: string;
    tiledversion: string;
    tileheight: number;
    tilesets: any;
    tilewidth: number;
    type: string;
    version: number;
    width: number;
}
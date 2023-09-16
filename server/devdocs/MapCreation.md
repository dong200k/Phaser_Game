# Map Creation with Tiled

In this document, we will go through how to create a level/dungeon for our game. This document is intended for developers to create a level for our game.

## What we will be using
- Windows 10/11
- Tiled map editor. Download [here](https://www.mapeditor.org/). Tested for version 1.10.1.

## Installing Tiled

1. To download tiled head to [mapeditor.org](https://www.mapeditor.org/).
2. Click on the "Download on itch.io" button.
3. Scroll down to the "Download Now" button. 
4. This software is free to use, but you can make a donation. To continue click on the "No thanks, just take me to the downloads" link.
5. Click on the Download button depending on which operating system you are using. Once you do so the installer should begin downloading.
6. Finally, once the download is completed, go through the installation process.

Check out the [tiled documentation](https://doc.mapeditor.org/en/stable/) for more usage information.

## Creating a dungeon

### Setting up the map.

After Tiled is installed we can now begin creating a map. 
1. To create a map, open up the Tiled software and click on "New Map...".
2. Enter the following settings and click "OK": 
    - Orientation: Orthogonal
    - Tile layer format: CSV
    - Tile render order: Right Down
    - Map size should be fixed. The width and height can be set to a reasonable amount. ~ 30 tiles - 120 tiles.
    - The tile size is the size of each tile in your tileset. We will be using 16px by 16px tiles.
3. Now we will add our tileset. Click on the "New Tileset..." button on the bottom right side of the screen. The New Tileset window should appear.
4. Enter the following settings and click "OK":
    - Name: dirt_dungeon_tileset. Note: We will need this name later in Phaser.
    - Type: Based on Tileset Image.
    - Check the "Embed in map" checkbox.
    - For the image source click on browse and find your tileset image file. (Make sure the image is saved in the location where you want to save your tilemap.)
    - Do not check the "Use Transparent color" checkbox.
    - Set the tilewidth, tileheight, margin, and spaceing based on your tileset image. For us we have tilewidth = 16px, tileheight = 16px, margin = 0px, and spacing = 0px.
5. On the Layer's panel we are going to create some new layers:
    - First remove any existing layers by right clicking on the layer in the Layer's menu and click "Remove Layers".
    - Then we are going to create the following layers:
        1. A Tile Layer called Background.
        2. A Tile Layer called Ground.
        3. A Tile Layer called Obstacle.
        4. An Object Layer called SpawnPoints.
        5. An Object Layer called WorldBounds.
    - Reorder the layers so that it appears in the following order:
        1. WorldBounds
        2. SpawnPoints
        3. Obstacle
        4. Ground
        5. Background

### Designing the map

Once the map is set up we can now begin to paint our tiles onto the different layers. We will be working with the three Tile layers (Background, Ground, and Obstacle). The background Layer will be to layout the background of the map. The Ground layer is used to layout some decorations ontop of the background. The obstacle layer is used to put up walls that will stop players, monsters, and projectiles. 

To start laying out the tiles:
1. select the layer you want to work with. 
2. Then, Select the stamp tool on top of the map editor and choose a tile from your tileset. 
3. Finally, click on the map to start painting. 

Note: If you created a large map you will need to zoom in to see the tiles.

### Adding Spawn Points

Now we will add some spawn points for the player's spawn location and monster's spawn location.

1. Select the SpawnPoints layer. 
2. Then select the Insert point icon on top of the map editor. 
3. Click on the map to add your spawn point.
4. Update the Class of the spawn point in the left menu. If we want a player spawn point enter player, if we want a monster spawn point enter monster.

Note: There should only be one player spawn point. There can be multiple monster spawn points.


### Adding World Bounds

We can also add a player world bounds to prevent the player from traveling off of our level. 

1. First select the WorldBounds layer.
2. Then select the Insert Rectangle icon on top of the map editor.
3. Click on the map to add a rectangle.
4. Resize the rectangle so that it covers the entire map. For best experience make sure the edges of the rectangle overlaps a little into the walls you created with your obstacle layer.
5. Update the Class of the rectangle to be "playerbounds".

Note: If the rectangle is in the way of editing other things on your map you can lock the WorldBounds Layer or even make it invisible in the Layers window.

## Exporting your dungeon

Once you created a tilemap that you like we can now save our files to the correct locations.
We will save a total of three files: 

### The tileset image

The tileset image is the image file with all your tiles. This would be stored on the client side under,
```
client/dist/tilemaps
```

If your tileset image is not yet extruded (margins and paddings are still 0) we will need to create a new image file with the extruded tiles. This will avoid the problem where Phaser render lines in-between each tile.

1. First change into the tilemaps directory.
```
cd client/dist/tilemaps
```
2. Then run the tile-extruder command. An example is shown below.
```
npx tile-extruder --tileWidth 16 --tileHeight 16 --input ./demo_map/dirt_dungeon_tileset.png --output ./demo_map/dirt_dungeon_tileset_extruded.png
```
- the tileWidth flag specifies the width of your tiles.
- the tileHeight flag specifies the height of your tiles.
- the input flag is the location of your tileset image.
- the output flag is what you want to name your extruded image as.

The extruder command will create a new image file where the tiles have a 1px margin and 2px padding.

### The tilemap tmx file

The tilemap tmx file is the program file created by the Tiled software. 

1. To save this file, inside your Tiled software, click File -> Save As...
2. Set the file location to "server/assets/tilemaps".
3. Give the file a name and make sure that the file type is .tmx.

Note: Depending on how you saved your tileset image, Tiled may ask you to relocate your image file the next time you open the tmx file.

### The tilemap json file

The tilemap json file is the file that will be read by our server. 

1. To save the file, inside your Tiled software, click File -> Export As...
2. Set the file location to "server/assets/tilemaps".
3. Give the file a name and make sure that the file type is .json.

## Adding your dungeon in the game

After we saved our files into their respective location, we can now let our server know about our new dungeon.

1. Open up the json file in "server/assets/tilemaps/dungeon.json".
2. Create a new object under existing ones.
```
[
    ...
    {
        "id": "8eba2633-d096-44df-a68d-d87adbd1a591",
        "name": "Demo Dungeon",
        "tilesetName": "dirt_map_tiles",
        "serverJsonLocation": "assets/tilemaps/demo_map/demo_map.json",
        "clientTilesetLocation": "tilemaps/demo_map/dirt_dungeon_tileset_extruded.png"
    }      
]
```
- The id is a uuid that you generate.
- The name is that you want your dungeon to be called. Pick a unique name.
- The tilesetName is the name that you want Phaser to refer to your tileset. Pick a unique name.
- The serverJsonLocation is the file location of your dungeon's json file that you created.
- The clientTilesetLocation is the location of your extruded tileset image file that you created.

3. Finally, on the client side in the SystemPreloadScene's preload() method we are going to load our tileset image.
```
    this.load.image("dirt_map_tiles", "tilemaps/demo_map/dirt_dungeon_tileset_extruded.png");
```
In the example above the first arg is your tilesetName and the second arg is the clientTilesetLocation.

All done, now the players can pick your dungeon inside the waiting room.
To extrude images we will use tile-extruder

E.g.
npx tile-extruder --tileWidth 16 --tileHeight 16 --input ./demo_map/dirt_dungeon_tileset.png --output ./demo_map/dirt_dungeon_tileset_extruded.png

map.addTilesetImage("dirt_dungeon_tileset", "dirt_map_tiles", 16, 16, 1, 2); // margin = 1, spacing = 2
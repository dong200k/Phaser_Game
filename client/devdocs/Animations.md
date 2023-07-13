# Animations 

This document will describe how animations are handled.

## Aseprite

The software that was used to create the animation png and json files was Aseprite. According to Phaser docs the correct method to export these files was as follows: 
1. Inside the Aseprite software, go to "File - Export Sprite Sheet"
2. On the Layout tab: 2a. Set the "Sheet type" to "Packed" 2b. Set the "Constraints" to "None" 2c. Check the "Merge Duplicates" checkbox
3. On the Sprite tab: 3a. Set "Layers" to "Visible layers" 3b. Set "Frames" to "All frames", unless you only wish to export a sub-set of tags
4. On the Borders tab: 4a. Check the "Trim Sprite" and "Trim Cells" options 4b. Ensure "Border Padding", "Spacing" and "Inner Padding" are all > 0 (1 is usually enough)
5. On the Output tab: 5a. Check "Output File", give your image a name and make sure you choose "png files" as the file type 5b. Check "JSON Data" and give your json file a name 5c. The JSON Data type can be either a Hash or Array, Phaser doesn't mind. 5d. Make sure "Tags" is checked in the Meta options 5e. In the "Item Filename" input box, make sure it says just "{frame}" and nothing more.
6. Click export

## Implementation 

Currently the files are loaded in with 
```
this.load.aesprite(key, png, json);
```

Then the animations are added individually inside the GameObject class.
```
scene.anims.createFromAseprite(texture, undefined, this);
```

To play the animation the play method is called on the GameObject.
```
gameObject.play({key: "fly", repeat: -1});
```
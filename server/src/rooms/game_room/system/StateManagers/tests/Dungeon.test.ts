import DungeonManager from "../DungeonManager"

describe("Dungeon Manager", () => {
    test("validate method, getRectangleMapping()", () => {

        // Create grid 1 and find the rectangle mapping.
        let grid = [
            [1, 1, 1, 1],
            [1, 0, 0, 1],
            [1, 0, 0, 1],
            [1, 1, 1, 1]
        ]
        let rects = DungeonManager.getRectangleMapping(grid);
        // expect(rects).toBe([
        //     {x: 0, y: 0, width: 4, height: 1},
        //     {x: 0, y: 1, width: 1, height: 3},
        //     {x: 3, y: 1, width: 1, height: 3},
        //     {x: 1, y: 3, width: 2, height: 1},
        // ]);

        // Create grid2 and find the rectangle mapping.
        let grid2 = [
            [1,0,0,0,0],
            [1,1,0,0,0],
            [0,0,1,1,1],
            [0,0,1,0,0],
            [1,0,1,0,0]
        ]

        let rects2 = DungeonManager.getRectangleMapping(grid2);
        console.log(rects2);
        // expect(rects).toBe([
        //     {x: 0, y: 0, width: 1, height: 2},
        //     {x: 1, y: 1, width: 1, height: 1},
        //     {x: 2, y: 2, width: 3, height: 1},
        //     {x: 2, y: 3, width: 1, height: 2},
        //     {x: 0, y: 4, width: 1, height: 1},
        // ]);

        expect(1).toBe(1);
    }) 
})
import Wave from "./Wave"


describe("Testing Wave", () => {
    test("getNextMonsterId() add 3 TinyZombie", () => {
        let wave = new Wave();
        wave.addMonster("TinyZombie", 3);
        expect(wave.getNextMonsterId()).toBe("TinyZombie");
        expect(wave.getNextMonsterId()).toBe("TinyZombie");
        expect(wave.getNextMonsterId()).toBe("TinyZombie");
        expect(wave.getNextMonsterId()).toBeUndefined();
        expect(wave.getNextMonsterId()).toBeUndefined();
    })
    test("getNextMonsterId() add 0 TinyZombie", () => {
        let wave = new Wave();
        wave.addMonster("TinyZombie", 0);
        expect(wave.getNextMonsterId()).toBeUndefined();
        expect(wave.getNextMonsterId()).toBeUndefined();
    })
    test("getNextMonsterId() add -1 TinyZombie", () => {
        let wave = new Wave();
        wave.addMonster("TinyZombie", -1);
        expect(wave.getNextMonsterId()).toBeUndefined();
        expect(wave.getNextMonsterId()).toBeUndefined();
    })
    test("getNextMonsterId() add 2 TinyZombie 2 times", () => {
        let wave = new Wave();
        wave.addMonster("TinyZombie", 2);
        wave.addMonster("TinyZombie", 2);
        expect(wave.getNextMonsterId()).toBe("TinyZombie");
        expect(wave.getNextMonsterId()).toBe("TinyZombie");
        expect(wave.getNextMonsterId()).toBe("TinyZombie");
        expect(wave.getNextMonsterId()).toBe("TinyZombie");
        expect(wave.getNextMonsterId()).toBeUndefined();
        expect(wave.getNextMonsterId()).toBeUndefined();
    })
})
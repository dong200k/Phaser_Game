import Wave from "./Wave"


describe("Testing Wave", () => {
    
    let callBack = ()=>{}
    let wave: Wave

    beforeEach(()=>{
        wave = new Wave(callBack)
    })

    test("getNextMonsterId() add 3 TinyZombie", () => {
        wave.addMonster("TinyZombie", 3);
        expect(wave.getNextMonsterId()).toBe("TinyZombie");
        expect(wave.getNextMonsterId()).toBe("TinyZombie");
        expect(wave.getNextMonsterId()).toBe("TinyZombie");
        expect(wave.getNextMonsterId()).toBeUndefined();
        expect(wave.getNextMonsterId()).toBeUndefined();
    })
    test("getNextMonsterId() add 0 TinyZombie", () => {
        wave.addMonster("TinyZombie", 0);
        expect(wave.getNextMonsterId()).toBeUndefined();
        expect(wave.getNextMonsterId()).toBeUndefined();
    })
    test("getNextMonsterId() add -1 TinyZombie", () => {
        wave.addMonster("TinyZombie", -1);
        expect(wave.getNextMonsterId()).toBeUndefined();
        expect(wave.getNextMonsterId()).toBeUndefined();
    })
    test("getNextMonsterId() add 2 TinyZombie 2 times", () => {
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
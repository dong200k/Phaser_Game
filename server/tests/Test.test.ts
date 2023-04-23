

describe("Math teacher", () => {
    test("one plus two is three", () => {
        expect(1+2).toBe(3);
    })

    test("rounding error", () => {
        expect(0.5 / 0.1).toBeCloseTo(5);
    })

    test("Exception is thrown", () => {
        expect(() => {throw new Error("Nice error")}).toThrowError();
    })
})
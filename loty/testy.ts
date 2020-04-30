import { fib } from "./program";
import { expect } from "chai";
import "mocha";

describe("Fibonacci", () => {
    it("should equal 1 for call with 0", () => {
        expect(fib(1)).to.equal(0);
    });
});
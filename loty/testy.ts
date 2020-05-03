import { fib } from "./program";
import { expect } from "chai";
import "mocha";

describe("Fibonacci", () => {
  let previous : number = 0;
  let current : number = 1;
  let temp : number;
  for (let i = 1; i < 1000; i++) {
    it("should equal ${previous} for call with ${i}", () => {
        expect(fib(i)).to.equal(previous);
    });
    temp = current;
    current += previous;
    previous = temp;
  }
});
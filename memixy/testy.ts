import {Builder, Capabilities} from 'selenium-webdriver';
import { memesInit, getBest } from "./memy";
import Meme from "./memy"
import { expect } from "chai";
import "mocha";
import { driver } from 'mocha-webdriver';

const filePath = `file://${process.cwd()}/plik.html`;

describe("Test memes", () => {
  it("Non empty init", () => {
    const memes = memesInit();
    expect(memes).to.not.equal(undefined);
    expect(memes).to.not.equal([]);
  });
  it("Best gives 3 best", () => {
    const memes = memesInit();
    const best = getBest(memes);
    expect(best).to.not.equal(undefined);
    expect(best).to.not.equal([]);
    expect(best).to.have.lengthOf(3);
    let worst_best_price = best[0].getPrice();
    for (const meme of best) {
      worst_best_price = Math.min(worst_best_price, meme.getPrice());
    }
    let counter = 0;
    for (const meme of memes) {
      if (worst_best_price < meme.getPrice())
        counter++;
    }
    expect(counter).to.not.be.above(2);
  });
});


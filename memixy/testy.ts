import {Builder, Capabilities} from 'selenium-webdriver';
import { memesInit, getBest } from "./memy";
import Meme from "./memy"
import { expect } from "chai";
import "mocha";
import { driver } from 'mocha-webdriver';

const filePath = `file://${process.cwd()}/plik.html`;

describe("Test memes", () => {
  const memes = memesInit();
  it("Non empty init", () => {
    expect(memes).to.not.equal(undefined);
    expect(memes).to.not.equal([]);
  });

  it("Init length is more than 3", () => {
    expect(memes.length).to.be.above(3);
  });

  it ("Best returns empty array from empty array", () => {
    const best = getBest([]);
    expect(best).to.deep.equal([]);
  });

  it ("Best returns smaller array if input length is in [1,2]", () => {
    const best = getBest([memes[0]])
    expect(best).to.have.lengthOf(1);
    const best2 = getBest([memes[0], memes[1]])
    expect(best2).to.have.lengthOf(2);
  });

  it("Best returns 3 memes that have the highest price", () => {
    const best = getBest(memes);
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


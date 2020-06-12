import {Builder, Capabilities} from 'selenium-webdriver';
import { createMemeTablesIfNeeded, getBest, allMemes } from "./memy";
import type Meme from "./memy"
import { expect } from "chai";
import { exec } from 'child_process';
import { driver } from 'mocha-webdriver';
import * as sqlite from 'sqlite3';
import "mocha";

const filePath = `file://${process.cwd()}/plik.html`;

sqlite.verbose();
exec(`rm ./test.db`);
const db = new sqlite.Database('test.db');

describe("Test memes", () => {
  createMemeTablesIfNeeded(db).then(async () => {
    it("Create DB", () => {
      expect(true).to.be.equal(true);
    });

    const all_memes = await allMemes(db);
    it("Init is not empty", () => {
      expect(all_memes).to.not.be(undefined);
      expect(all_memes).to.not.equal([]);
      expect(all_memes.length).to.be.above(3);
    });

    it("Best returns 3 memes that have the highest price", async () => {
      const best = await getBest(db);
      expect(best).to.have.lengthOf(3);

      let worst_best_price = best[0].getPrice();

      for (const meme of best) {
        worst_best_price = Math.min(worst_best_price, meme.getPrice());
      }

      let counter = 0;
      for (const meme of all_memes) {
        if (worst_best_price < meme.getPrice())
          counter++;
      }
      expect(counter).to.not.be.above(2);
    });
  },
    () => {
    it("Create DB", () => {
      expect(false).to.be.equal(true);
    });
  });

});


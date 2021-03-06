import {Builder, Capabilities} from 'selenium-webdriver';
import { fib } from "./program";
import { expect } from "chai";
import "mocha";
import { driver } from 'mocha-webdriver';

const filePath = `file://${process.cwd()}/plik.html`;

describe("Fibonacci", () => {
  let previous : number = 0;
  let current : number = 1;
  let temp : number;
  it("Test fibonaci up to 100000", () => {
    for (let i = 1; i < 100000; i++) {
      expect(fib(i)).to.equal(previous);
      temp = current;
      current += previous;
      previous = temp;
    }
  });
});

describe('testDrugi', function () {

  it('should change background', async function() {
    this.timeout(20000);
    await driver.get(filePath);
    expect(await driver.find('#delayed-flights').getCssValue('background-color')).to.be.equal('rgba(0, 0, 0, 0)');
    expect(await driver.find('#delayed-flights').doClick().getCssValue('background-color')).to.not.be.equal('rgba(0, 0, 0, 0)');
  });

  it('formulage should work', async function() {
    this.timeout(20000);
    await driver.get(filePath);
    expect(await driver.find('#loty tr:nth-child(2) td:nth-child(3)').getText()).to.include('Maszyna');
    expect(await driver.find('input[type=submit]').isEnabled()).to.be.false;
    const command = `document.querySelector('input[name=flight-date]').value = "2029-09-04";`;
    driver.executeScript(command);
    await driver.find('input[name=fname]').sendKeys('Jan');
    await driver.find('input[name=lname]').sendKeys('Woreczko');
    await driver.find('select[name=from] [value=Maszyna]').doClick();
    expect(await driver.find('select[name=from]').getText()).to.include('Maszyna');
    await driver.find('select[name=destination] [value=Maszyna]').doClick();
    expect(await driver.find('input[type=submit]').isEnabled()).to.be.false;
    await driver.find('select[name=destination] [value=Kompilator]').doClick();
    expect(await driver.find('input[type=submit]').isEnabled()).to.be.true;
    await driver.find('input[type=submit]').doClick();
    expect(await driver.find('#success_modal #modal-message').getText()).to.include('Rezerwacja złożona pomyślnie');

    let link = '.gr-sidebar > ul:nth-child(3) > li:nth-child(1)'

    try {
      await driver.find(link).doClick();
      expect("Miało się nie kliknąć").to.equal("a klikło"); //returns AssertionError
    } catch(err) {
      expect(err.name).to.equal('ElementClickInterceptedError');
    }

    try {
      await driver.find('#modal-message.success').doClick();
    } catch(err) {
      expect("Powinno dać się").to.equal("kliknąć");
    }

    //Teraz okienko powinno zniknąć

    try {
      await driver.find(link).doClick();
    } catch(err) {
      expect("Powinno dać się").to.equal("kliknąć");
    }



  });

})
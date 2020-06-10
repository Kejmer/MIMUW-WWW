"use strict";
exports.__esModule = true;
exports.getBest = exports.memesInit = void 0;
var Meme = /** @class */ (function () {
    function Meme(id, name, file_name, price) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.file_name = file_name;
        this.history = [price];
    }
    Meme.prototype.getId = function () {
        return this.id;
    };
    Meme.prototype.getName = function () {
        return this.name;
    };
    Meme.prototype.getPrice = function () {
        return this.price;
    };
    Meme.prototype.getFileName = function () {
        return this.file_name;
    };
    Meme.prototype.getHistory = function () {
        return this.history;
    };
    Meme.prototype.setPrice = function (new_price) {
        if (this.price === new_price)
            return;
        this.price = new_price;
        this.history.unshift(new_price);
    };
    return Meme;
}());
exports["default"] = Meme;
function memesInit() {
    var schema = [];
    var i = 1;
    schema.push(new Meme(i++, "42", "42.jpg", 42));
    schema.push(new Meme(i++, "Cyberksio", "cyberpunk.png", 13));
    schema.push(new Meme(i++, "Frontend", "frontend.png", 1023));
    schema.push(new Meme(i++, "Before and after", "math.jpg", 1));
    schema.push(new Meme(i++, "Teoria mnogosci", "mnogosc.jpg", 412));
    schema.push(new Meme(i++, "Piasek", "plaza.jpg", 551));
    schema.push(new Meme(i++, "Perspektywa bułki", "pov.png", 112));
    schema.push(new Meme(i++, "Papier toaletowy", "pqpi34.jpg", 152));
    schema.push(new Meme(i++, "Sratch chad", "scratch.png", 1020));
    schema.push(new Meme(i++, "Vim", "vim.png", 0));
    schema.push(new Meme(i++, "Bledy kompilacji", "znowu_oni.png", 1822));
    return schema;
}
exports.memesInit = memesInit;
function getBest(memes) {
    function compare(a, b) {
        return b.getPrice() - a.getPrice();
    }
    return memes.sort(compare).slice(0, Math.min(3, memes.length));
}
exports.getBest = getBest;

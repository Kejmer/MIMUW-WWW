"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.allMemes = exports.getBest = exports.newMeme = exports.getMeme = exports.createMemeTablesIfNeeded = void 0;
function createMemeTablesIfNeeded(db) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve, reject) {
                    console.log("START");
                    db.all("SELECT COUNT(*) AS cnt FROM sqlite_master WHERE type='table' AND name IN ('memes', 'history');", function (err, rows) {
                        if (err) {
                            reject('DB Error');
                            return;
                        }
                        if (rows[0].cnt === 2) {
                            console.log('Database tables already exist.');
                            resolve();
                            return;
                        }
                        console.log('Creating database tables...');
                        db.serialize(function () {
                            db.run("\n          CREATE TABLE history (\n            meme_id INTEGER NOT NULL,\n            price INTEGER NOT NULL,\n            created_at REAL NOT NULL,\n            author TEXT\n          )\n          ", [], function (err) {
                                if (err) {
                                    reject('DB Error');
                                    return;
                                }
                            });
                            db.run("\n        CREATE INDEX history_time_idx\n          ON history(created_at)\n        ", [], function (err) {
                                if (err) {
                                    reject('DB Error');
                                    return;
                                }
                            });
                            db.run("\n          CREATE TABLE memes (\n            id INTEGER PRIMARY KEY,\n            name TEXT NOT NULL,\n            url TEXT NOT NULL,\n            price INTEGER NOT NULL,\n            last_updator TEXT\n          )", [], function (err) {
                                if (err) {
                                    reject('DB Error');
                                    return;
                                }
                                console.log('Done.');
                                memesInit(db);
                                resolve();
                            });
                        });
                    });
                })];
        });
    });
}
exports.createMemeTablesIfNeeded = createMemeTablesIfNeeded;
function memeFromRow(row) {
    return new Meme(row.id, row.name, row.url, row.price, row.last_updator);
}
function getMeme(db, id) {
    return new Promise(function (resolve, reject) {
        db.get('SELECT * FROM memes WHERE id = ?', [id], function (err, row) {
            if (err) {
                reject(err);
                return;
            }
            if (!row) {
                resolve(undefined);
            }
            else {
                resolve(memeFromRow(row));
            }
        });
    });
}
exports.getMeme = getMeme;
var Meme = /** @class */ (function () {
    function Meme(id, name, file_name, price, updator) {
        this.id = id;
        this.name = name;
        this.file_name = file_name;
        this.price = price;
        this.updator = updator;
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
    Meme.prototype.getUpdator = function () {
        return this.updator;
    };
    Meme.prototype.getHistory = function (db) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            db.all('SELECT price, author FROM history WHERE meme_id = ? ORDER BY created_at DESC', [_this.id], function (err, row) {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(row);
            });
        });
    };
    Meme.prototype.setPrice = function (db, new_price, author) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (new_price == _this.price || new_price < 0) {
                resolve();
                return;
            }
            var old_price = _this.price;
            var old_author = _this.updator;
            _this.price = new_price;
            _this.updator = author;
            db.serialize(function () {
                db.run("BEGIN EXCLUSIVE");
                db.run("INSERT INTO history (meme_id, price, created_at, author) VALUES(?, ?, date('now'), ?)", [_this.id, old_price, old_author], function (err, row) {
                    if (err) {
                        resolve();
                        db.run("ROLLBACK");
                        _this.price = old_price;
                        _this.updator = old_author;
                        return;
                    }
                });
                db.run("\n        UPDATE memes SET price = ?, last_updator = ? WHERE id = ?;", [new_price, author, _this.id], function (err, row) {
                    if (err) {
                        resolve();
                        db.run("ROLLBACK");
                        _this.price = old_price;
                        _this.updator = old_author;
                        return;
                    }
                });
                db.run("COMMIT");
            });
            resolve();
        });
    };
    return Meme;
}());
exports["default"] = Meme;
function newMeme(db, name, url, price, author) {
    db.run("INSERT INTO memes (name, url, price, last_updator) VALUES(?, ?, ?, ?)\n  ", [name, url, price, author], function (err, row) { });
}
exports.newMeme = newMeme;
function memesInit(db) {
    newMeme(db, "42", "42.jpg", 42, "admin");
    newMeme(db, "Cyberksio", "cyberpunk.png", 13, "admin");
    newMeme(db, "Frontend", "frontend.png", 1023, "admin");
    newMeme(db, "Before and after", "math.jpg", 1, "admin");
    newMeme(db, "Teoria mnogosci", "mnogosc.jpg", 412, "admin");
    newMeme(db, "Piasek", "plaza.jpg", 551, "admin");
    newMeme(db, "Perspektywa bułki", "pov.png", 112, "admin");
    newMeme(db, "Papier toaletowy", "pqpi34.jpg", 152, "admin");
    newMeme(db, "Sratch chad", "scratch.png", 1020, "admin");
    newMeme(db, "Vim", "vim.png", 0, "admin");
    newMeme(db, "Bledy kompilacji", "znowu_oni.png", 1822, "admin");
}
function getBest(db) {
    return new Promise(function (resolve, reject) {
        db.all("SELECT * FROM memes ORDER BY price DESC LIMIT 3", [], function (err, row) {
            if (err) {
                reject(err);
                return;
            }
            resolve(row.map(function (r) { return memeFromRow(r); }));
        });
    });
}
exports.getBest = getBest;
function allMemes(db) {
    return new Promise(function (resolve, reject) {
        db.all("SELECT * FROM memes", [], function (err, row) {
            if (err) {
                reject(err);
                return;
            }
            resolve(row.map(function (r) { return memeFromRow(r); }));
        });
    });
}
exports.allMemes = allMemes;

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
var createError = require("http-errors");
var express = require("express");
var path = require("path");
// import * as cookieParser from 'cookie-parser';
// import * as logger from 'morgan';
var memer = require("./memy");
var csurf = require("csurf");
var sqlite = require("sqlite3");
var app = express();
var csrfProtection = csurf({ cookie: true });
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
// app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
sqlite.verbose();
var db = new sqlite.Database('memes.db');
memer.createMemeTablesIfNeeded(db).then(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        // view engine setup
        app.get('/', function (req, res, next) {
            return __awaiter(this, void 0, void 0, function () {
                var myBest;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, memer.getBest(db)];
                        case 1:
                            myBest = _a.sent();
                            if (myBest === undefined)
                                next(createError(500));
                            res.render('meme_index', { memes: myBest, title: "memy" });
                            return [2 /*return*/];
                    }
                });
            });
        });
        app.get('/meme/:memeId(\\d+)', csrfProtection, function (req, res, next) {
            return __awaiter(this, void 0, void 0, function () {
                var id, pickedMeme, history;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            id = parseInt(req.params.memeId, 10);
                            return [4 /*yield*/, memer.getMeme(db, id)];
                        case 1:
                            pickedMeme = _a.sent();
                            if (pickedMeme === undefined)
                                next(createError(404));
                            return [4 /*yield*/, pickedMeme.getHistory(db)];
                        case 2:
                            history = _a.sent();
                            console.log(history);
                            res.render('meme', { meme: pickedMeme, history: history, csrfToken: req.csrfToken() });
                            return [2 /*return*/];
                    }
                });
            });
        });
        app.post('/meme/:memeId(\\d+)', csrfProtection, function (req, res, next) {
            return __awaiter(this, void 0, void 0, function () {
                var id, price, pickedMeme, history;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            id = parseInt(req.params.memeId, 10);
                            if (isNaN(req.body.price))
                                next(createError(400));
                            price = req.body.price;
                            return [4 /*yield*/, memer.getMeme(db, id)];
                        case 1:
                            pickedMeme = _a.sent();
                            if (pickedMeme === undefined)
                                next(createError(404));
                            pickedMeme.setPrice(db, price);
                            return [4 /*yield*/, pickedMeme.getHistory(db)];
                        case 2:
                            history = _a.sent();
                            res.render('meme', { meme: pickedMeme, history: history, csrfToken: req.csrfToken() });
                            return [2 /*return*/];
                    }
                });
            });
        });
        // catch 404 and forward to error handler
        app.use(function (req, res, next) {
            next(createError(404));
        });
        // error handler
        app.use(function (err, req, res, next) {
            // set locals, only providing error in development
            console.log("ERROR");
            res.locals.message = err.message;
            res.locals.error = req.app.get('env') === 'development' ? err : {};
            // render the error page
            res.status(err.status || 500);
            res.render('error');
        });
        return [2 /*return*/];
    });
}); });
module.exports = app;

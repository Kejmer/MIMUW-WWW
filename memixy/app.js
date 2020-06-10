"use strict";
exports.__esModule = true;
var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var memer = require("./memy.js");
var app = express();
var MemeHolder = /** @class */ (function () {
    function MemeHolder(memes) {
        this.memes = memes;
    }
    MemeHolder.prototype.getMeme = function (id) {
        for (var _i = 0, _a = this.memes; _i < _a.length; _i++) {
            var meme = _a[_i];
            if (meme.getId() === id)
                return meme;
        }
    };
    MemeHolder.prototype.getAll = function () {
        return this.memes;
    };
    return MemeHolder;
}());
var memeHolder = new MemeHolder(memer.memesInit());
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.get('/', function (req, res, next) {
    res.render('meme_index', { memes: memer.getBest(memeHolder.getAll()), title: "memy" });
});
app.get('/meme/:memeId', function (req, res, next) {
    var id = parseInt(req.params.memeId, 10);
    var pickedMeme = memeHolder.getMeme(id);
    if (pickedMeme === undefined)
        next(createError(404));
    res.render('meme', { meme: pickedMeme, history: pickedMeme.getHistory() });
});
app.post('/meme/:memeId', function (req, res, next) {
    if (Number.isInteger(req.params.memeId))
        next(createError(400));
    var id = parseInt(req.params.memeId, 10);
    var pickedMeme = memeHolder.getMeme(id);
    var price = req.body.price;
    if (pickedMeme === undefined)
        next(createError(404));
    pickedMeme.setPrice(price);
    res.render('meme', { meme: pickedMeme, history: pickedMeme.getHistory() });
});
// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});
// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    // render the error page
    res.status(err.status || 500);
    res.render('error');
});
module.exports = app;

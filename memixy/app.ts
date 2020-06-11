import * as createError from 'http-errors';
import * as express from 'express';
import * as path from 'path';
import * as cookieParser from 'cookie-parser';
import * as logger from 'morgan';
import * as memer from './memy';
import type Meme from './memy';
import * as sqlite from 'sqlite3';
const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

sqlite.verbose();
const db = new sqlite.Database('memes.db');

memer.createMemeTablesIfNeeded(db).then(async () => {
  // view engine setup

  app.get('/', async function(req, res, next) {
    const myBest = await memer.getBest(db);
    if (myBest === undefined)
      next(createError(500));
    res.render('meme_index', {memes: myBest, title: "memy"});
  });

  app.get('/meme/:memeId(\\d+)', async function(req, res, next) {
    const id = parseInt(req.params.memeId, 10);

    const pickedMeme = await memer.getMeme(db,id);
    if (pickedMeme === undefined)
      next(createError(404));

    const history = await pickedMeme.getHistory(db);
    console.log(history);
    res.render('meme', {meme: pickedMeme, history: history});
  });

  app.post('/meme/:memeId(\\d+)', async function (req, res, next) {
    const id = parseInt(req.params.memeId, 10);
    if (isNaN(req.body.price))
      next(createError(400));
    const price = req.body.price;

    const pickedMeme = await memer.getMeme(db,id);
    if (pickedMeme === undefined)
      next(createError(404));
    pickedMeme.setPrice(db, price);

    const history = await pickedMeme.getHistory(db);
    res.render('meme', {meme: pickedMeme, history: history});

  });

  // catch 404 and forward to error handler
  app.use(function(req, res, next) {
    next(createError(404));
  });

  // error handler
  app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    console.log("ERROR");
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
  });

});
  module.exports = app;










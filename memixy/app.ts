import * as createError from 'http-errors';
import * as express from 'express';
import * as path from 'path';
import * as cookieParser from 'cookie-parser';
import * as logger from 'morgan';
import * as memer from './memy.js';
import type Meme from './memy.js';
const app = express();

class MemeHolder {
  private memes : Meme[];

  constructor(memes : Meme[]) {
    this.memes = memes;
  }

  getMeme(id : number) : Meme {
    for (const meme of this.memes)
      if (meme.getId() === id)
        return meme;
  }

  getAll() : Meme[] {
    return this.memes;
  }
}

const memeHolder = new MemeHolder(memer.memesInit());


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.get('/', function(req, res, next) {
  res.render('meme_index', {memes: memer.getBest(memeHolder.getAll()), title: "memy"});
});


app.get('/meme/:memeId', function(req, res, next) {
  const id = parseInt(req.params.memeId, 10);
  const pickedMeme = memeHolder.getMeme(id);
  if (pickedMeme === undefined)
    next(createError(404));
  res.render('meme', {meme: pickedMeme, history: pickedMeme.getHistory()});
});


app.post('/meme/:memeId', function (req, res, next) {
  if (isNaN(req.body.price))
    next(createError(400));

  const id = parseInt(req.params.memeId, 10);
  const pickedMeme = memeHolder.getMeme(id);
  const price = req.body.price;

  if (pickedMeme === undefined)
    next(createError(404));

  pickedMeme.setPrice(price);
  res.render('meme', { meme: pickedMeme, history: pickedMeme.getHistory() })
})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

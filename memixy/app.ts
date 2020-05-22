const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const memer = require('./memy.js');
import Meme from './memy.js';
const app = express();

class MemeHolder {
  private memes : Meme[];

  constructor(memes : Meme[]) {
    this.memes = memes;
  }

  getMeme(id : number) : Meme {
    for (let meme of this.memes)
      if (meme.getId() == id)
        return meme;
  }

  getAll() : Meme[] {
    return this.memes;
  }
}

let memeHolder = new MemeHolder(memer.memesInit());


// const indexRouter = require('./routes/index');
// const memesRouter = require('./routes/meme');


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', indexRouter);
// app.use('/meme', memesRouter);


app.get('/', function(req, res, next) {
  res.render('meme_index', {memes: memer.getBest(memeHolder.getAll()), title: "memy"});
});


app.get('/meme/:memeId', function(req, res, next) {
  let meme = memeHolder.getMeme(parseInt(req.params.memeId));
  res.render('meme', {meme: meme, history: meme.getHistory()});
});


app.post('/meme/:memeId', function (req, res) {
  let meme = memeHolder.getMeme(parseInt(req.params.memeId));
  var price = req.body.price;
  meme.setPrice(price);
  res.render('meme', { meme: meme, history: meme.getHistory() })
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

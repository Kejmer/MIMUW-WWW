import * as createError from 'http-errors';
import * as express from 'express';
import * as path from 'path';
import * as cookieParser from 'cookie-parser';
import * as memer from './memy';
import * as logger from 'morgan';
import * as csurf from 'csurf';
import type Meme from './memy';
import * as sqlite from 'sqlite3';
import * as session from 'express-session';
import * as User from './login'


const app = express();
const csrfProtection = csurf({ cookie: true });

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(logger('dev'));
app.use(session({secret: "deadBEEF4242424242424242", resave: false, saveUninitialized: false}))
app.use(express.static(path.join(__dirname, 'public')));

sqlite.verbose();
const db = new sqlite.Database('memes.db');


memer.createMemeTablesIfNeeded(db).then(async () => {
  await User.createLoginTables(db);
  // view engine setup

  app.get('/', async function(req, res, next) {
    const myBest = await memer.getBest(db);
    if (myBest === undefined) {
      next(createError(500));
      return;
    }
    res.render('meme_index', {memes: myBest, title: "memy"});
  });

  app.get('/meme/:memeId(\\d+)', csrfProtection, async function(req, res, next) {
    const id = parseInt(req.params.memeId, 10);

    const pickedMeme = await memer.getMeme(db,id);
    if (pickedMeme === undefined) {
      next(createError(404));
      return;
    }

    const history = await pickedMeme.getHistory(db);
    res.render('meme', {meme: pickedMeme, history: history, csrfToken: req.csrfToken()});
  });

  app.post('/meme/:memeId(\\d+)', csrfProtection, async function (req, res, next) {
    if (!req.session.user) {
      next(createError(401));
      return;
    }

    const id = parseInt(req.params.memeId, 10);
    if (isNaN(req.body.price)) {
      next(createError(400));
      return;
    }
    const price = req.body.price;

    const pickedMeme = await memer.getMeme(db,id);
    if (pickedMeme === undefined) {
      next(createError(404));
      return;
    }
    pickedMeme.setPrice(db, price, req.session.user);

    const history = await pickedMeme.getHistory(db);
    res.render('meme', {meme: pickedMeme, history: history, csrfToken: req.csrfToken()});

  });

  app.get('/login', (req, res) => {
    if (req.session.user) {
      res.redirect("/");
      return;
    }
    res.render('login', {title: "Logowanie"});
  });

  app.post('/login', async (req, res, next) => {
    if (req.session.user) {
      res.redirect("/");
      return;
    }
    let username = req.body.username;
    let password = req.body.password;

    if (await User.login(db, username, password)) {
      req.session.user = username;
      res.redirect("/");
    } else {
      res.render('login', {title: "Błędne dane logowania"});
    }
  });

  app.post('/logout', (req, res) => {
    req.session.user = false;
    res.redirect("/");
  });

  app.get('/register', (req, res) => {
    if (req.session.user) {
      res.redirect("/");
      return;
    }
    res.render('register', {title: "Zarejestruj się!"});
  });

  app.post('/register', async (req, res, next) => {
    if (req.session.user) {
      res.redirect("/");
      return;
    }

    let username = req.body.username;
    let password = req.body.password;

    if (await User.newUser(db, username, password)) {
      req.session.user = username;
      res.redirect("/");
    } else {
      res.render('register', {title: "Użytkownik już istnieje"});
    }

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










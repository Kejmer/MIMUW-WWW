var express = require('express');
var router = express.Router();
var memeModel = require('../memy.js');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('meme_index', {memes: memeModel.getBest(req.app.locals.memy), title: "memy"});
});

module.exports = router;

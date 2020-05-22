var express = require('express');
var router = express.Router();
var memeModel = require('../memy.js');


router.get('/:memeId', function(req, res, next) {
  var meme = req.app.locals.memy[parseInt(req.params.memeId) - 1];
  res.render('meme', {meme: meme, history: meme.history.reverse()});
});

app.use(express.urlencoded({extended: true}));

app.post('/meme/:memeId', function (req, res) {
   var meme = req.app.locals.memy[parseInt(req.params.memeId) - 1];
   var price = req.body.price;
   meme.change_price(price);
   console.log(req.body.price);
   res.render('meme', { meme: meme })
})

module.exports = router;

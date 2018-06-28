var express = require('express');
var router = express.Router();
var Rectangle = require('./../models/rectangle');

/* GET home page. */
router.get('/', function(req, res, next) {


  const square = new Rectangle(20, 10);

  console.log(square); // 100

  res.render('index', { title: 'Express' });
});

module.exports = router;

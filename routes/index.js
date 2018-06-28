var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  class Rectangle {
    constructor(height, width) {
      this.height = height;
      this.width = width;
    }
    // Getter
    get area() {
      return this.calcArea();
    }
    // Method
    calcArea() {
      return this.height * this.width;
    }
  }

  const square = new Rectangle(20, 10);

  console.log(square); // 100

  res.render('index', { title: 'Express' });
});

module.exports = router;

var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
    console.log("index page");
});

//POST = saving data
//GET = getting data
//PUT = Updating data

router.get('/productDetails', function(req, res) {
    console.log("in the productDetails");
});

router.get('/productList', function(req, res) {
   console.log("in the productList");
});

module.exports = router;

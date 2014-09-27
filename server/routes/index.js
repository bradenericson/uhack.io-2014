var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res) {
    res.render('index', { title: 'Express' });
});



//POST = saving data
//GET = getting data
//PUT = Updating data

module.exports = router;

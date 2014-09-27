var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  Article = mongoose.model('Article');

var Client = require('node-rest-client').Client;
client = new Client();

module.exports = function (app) {
  app.use('/', router);
};

router.get('/', function (req, res, next) {

  Article.find(function (err, articles) {
    if (err) return next(err);
    res.render('index', {
      title: 'Generator-Express MVC',
      articles: articles
    });
  });

});

//ProductDetails controller Action
router.get('/productDetails', function (req, res, next) {
    console.log("in the product details!");
    console.log("res: " + res);
    console.log("req: " + req);
});

//ProductList controller action
router.get('/productList', function (req, res, next) {
    //Make some calls to target's API!
    console.log("in the product list!");
    console.log("res: " + res);

    var categoryId = req.param('cid');
    console.log("cid: " + categoryId);

    console.log("about to make the restful api call!");

    var resourceUri = "http://api.target.com/v2/products/categories/" + categoryId + "?depth=5&type=online&key=J5PsS2XGuqCnkdQq0Let6RSfvU7oyPwF";

    client.get(resourceUri, function(data, response){
        // parsed response body as js object
        console.log("data : " + data);
        // raw response
        console.log("response: " + response);
    });


});


router.get('/userRegistration', function(req, res, next) {
    var firstName = req.param('firstName');
    var lastName = req.param('lastName');
    var email = req.param('email');


});
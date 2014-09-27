//hah those front-end noobs are noobs

var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'),
    User = mongoose.model('User');
// User = mongoose.model('User');

var global = {};
global.categories = {
    "blazers&jackets" : 921501, "sweatshirts&sweatpants" : 1033018,
    "pants&shorts" : 3688, "tops" : 3689,
    "activewear" : 3676, "jeans" : 3677,
    "outerwear" : 3678, "pants" : 3679,
    "graphic tees" : 833001, "shortsleevetees" : 834001,
    "polos" : 834002, "dressshirts" : 834003, "casualbuttondowns" : 834004,
    "longsleevetees" : 834005, "shirts" : 3680,
    "shorts" : 3681, "bottoms" : 3690,
    "robes" : 3691, "sets" : 3692,
    "sleepwearpajamas&pajamas" : 3682, "socks" : 3683,
    "suitseperates" : 3684, "sweaters" : 3685,
    "underwear" : 3687, "mensclothing" : 3675
};

var Client = require('node-rest-client').Client;
client = new Client();

module.exports = function (app) {
    app.use('/', router);
};

router.get('/', function (req, res, next) {

    /* Article.find(function (err, articles) {
     if (err) return next(err);
     res.render('index', {
     title: 'Generator-Express MVC',
     articles: articles
     });
     });*/

});

//ProductDetails controller Action
router.get('/productDetails', function (req, res, next) {
    console.log("in the product details!");

    var productId = req.param('dpci');

    console.log("DPCI: " + productId);

    if (productId == null) {
        //If the productId is null, do?
        console.log("productId is null.");
        res.status(404).send("Selected Product ID does not exist.");
    }

    var resourceUri = "http://api.target.com/v2/products/" + productId + "?idType=DPCI&key=J5PsS2XGuqCnkdQq0Let6RSfvU7oyPwF";
    console.log("resourceUri: " + resourceUri);

    client.get(resourceUri, function (data, response) {
        console.log("data: " + data);
        console.log("response: " + response);

        console.log("data is not null");
        //Sending Andrizzle all of the information about the product. Namely: Name, Images URLs, Size,
        //Colors, Related Reviews (requires filtration), Online availability, and Price.
        console.log("Name: " + data.CatalogEntryView[0].title);
        console.log("Price: " + data.CatalogEntryView[0].Offers[0].OfferPrice[0].formattedPriceValue);

        res.send(data);

    });//end client.get();
});

//ProductList controller action
router.get('/productList', function (req, res, next) {
    //Make some calls to target's API!
    console.log("in the product list!");
    console.log("res: " + res);

    var categoryId = req.param('cid'); //categoryId is the ID that the user clicks on. expecting from andrizzle
    console.log("cid: " + categoryId);

    console.log("about to make the restful api call!");

    if (categoryId == null) {
        categoryId = 3675; //root level taxonomy
    }

    var resourceUri = "https://api.target.com/v2/products/search?categoryId=" + categoryId + "&key=J5PsS2XGuqCnkdQq0Let6RSfvU7oyPwF";

    console.log("resourceUri: " + resourceUri);

    client.get(resourceUri, function (data, response) {
        // parsed response body as js object
        console.log("data : " + data);
        // raw response
        console.log("response: " + response);

        data = data["CatalogEntryView"];
        var content = []; //array of objects
        /*
            each object is an "item"
            each item has these properties:
                - DPCI
                - sizes
                - name

                if there's any extra "crap" on the different sizes, it's cut off.
        */

        for(var i=0; i<data.length; i++){//first level
            content[i] = {};
            content[i].DPCI = data[i].DPCI;

            for(var k=0; k < data[i].ItemAttributes[0].Attribute.length; k++){
                if(data[i].ItemAttributes[0].Attribute[k].name === "Size"){
                    content[i].sizes = data[i].ItemAttributes[0].Attribute[k].description;
                }
                if(data[i].ItemAttributes[0].Attribute[k].name === "ParentTitle"){
                    content[i].name = data[i].ItemAttributes[0].Attribute[k].description;
                }
            }
            //fix the sizes array
            if(content[i].sizes !== undefined){
                content[i].sizes = content[i].sizes.split(","); //turns string into array seperated by ","

                for(var j=0; j<content[i].sizes.length; j++){
                    if(content[i].sizes[j].indexOf("#") > 0){   //checks to see if this string has extra crap
                        content[i].sizes[j] = content[i].sizes[j].substring(0,content[i].sizes[j].indexOf("#")); //grabs everything BEFORE the first index of #
                    }
                }
            }


        }



        //Do some processing here to filter the products according to user information that I query from Mongo.
        //Also need to get Name, Price, and Radical Rating System
       //console.log(content);
        res.send(content); //used to be data -Braden

        //Here, go through and check all sizes pertaining to the user. 

    });//end client.get();

});


router.post('/register', function(req, res, next) {
    var userProperties = {
        name: {
            first: req.param('firstName'),
            last: req.param('lastName')
        },
        email: req.param('email'),
        password: req.param('password'),
        gender: req.param('gender'),
        height: req.param('height'),
        shirtSize: req.param('shirtSize'),
        pants: {
            length: req.param('pantsLength'),
            waist: req.param('waist')
        },
        reviews: []
    };


    var newUser = new User(userProperties);
    newUser.save(function (err) {
        if (err) return handleError(err);
        // saved!
        console.log("USER ADDED SUCCESSFULLY!");
        res.send({"message": "Success :)"});
    });


});

router.post('/login', function(req, res, next) {
    var email = req.param('email');
    var password = req.param('password');

    //User.find( { email: email, password: password })
    User.where('email').equals(email).exec(function(res){
        console.log("inside callback:" + res);
    });
});


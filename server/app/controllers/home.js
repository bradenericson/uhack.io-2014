//hah those front-end noobs are noobs

var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'),
    User = mongoose.model('User');
// User = mongoose.model('User');

//Ensure that Andrizzle follows the name appropriately in the GET request
var global = {};
global.categories = {
    "blazers&jackets": 921501, "sweatshirts&sweatpants": 1033018,
    "pants&shorts": 3688, "tops": 3689,
    "activewear": 3676, "jeans": 3677,
    "outerwear": 3678, "pants": 3679,
    "graphictees": 833001, "shortsleevetees": 834001,
    "polos": 834002, "dressshirts": 834003, "casualbuttondowns": 834004,
    "longsleevetees": 834005, "shirts": 3680,
    "shorts": 3681, "bottoms": 3690,
    "robes": 3691, "sets": 3692,
    "sleepwearpajamas&pajamas": 3682, "socks": 3683,
    "suitseperates": 3684, "sweaters": 3685,
    "underwear": 3687, "mensclothing": 3675
};

global.reviews = [
    "I love this shirt, and it is true to size and comfortable, however the stitching came loose under one arm and has to be retired until it can be fixed.",
    "Very Comfortable light fabric and get lots of comments too!!",
    "My son gets so many compliments on this shirt. My nephew just saw it on him and liked it so much that I sent one to him.",
    "I bought a shirt for my husband...and a small for myself! The shirt has a really cool design. Plus, the material is super cozy and soft! One of my favorites!",
    "My husband loved it. He was so surprised. He even gets attention when he wears it. People ask where he got it.",
    "I bought these for my son, and he says they fit well and are comfortable.",
    "True to size good quality",
    "This article of clothing is really nice for the price the fit was on point. The color was good. No complaints, would give it 5 stars but nothing is perfect.",
    "When I saw these on sale, I thought it was time to buy some new clothes. They look good, fit well, and are very comfortable. Most importantly, they are way less expensive than elsewhere!."


];

var Client = require('node-rest-client').Client;
client = new Client();


module.exports = function (app) {

    app.use('/', router);


};

var corsOptions = {
    origin: 'localhost:8081'
};


// invoked for any requests passed to this router
router.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type,X-Requested-With');
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,HEAD,DELETE,OPTIONS');
    next();
});

router.get('/', function (req, res, next) {

    /* Article.find(function (err, articles) {
     if (err) return next(err);
     res.render('index', {
     title: 'Generator-Express MVC',
     articles: articles
     });
     });*/

});

var html = "<!DOCTYPE HTML><script src='//cdn.rawgit.com/jpillora/xdomain/0.6.15/dist/0.6/xdomain.min.js' master='http://localhost:8081'></script>";

router.get('/proxy.html', function (req, res, next) {
    res.writeHeader(200, {"Content-Type": "text/html"});  // <-- HERE!
    res.write(html);  // <-- HERE!
    res.end();
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

        data = data['CatalogEntryView'];
        var content = [];

        if (data === null || data.length < 0) {
            res.status(404).send("There was an error displaying the product details!");
        }

        for (var i = 0; i < data.length; i++) {
            content[i] = {};
            content[i].Name = data[0].title;
            console.log("data.title: " + data[0].title);
            content[i].PrimaryImage = data[0].Images[0].PrimaryImage[0].image;
            content[i].Color = "";
            content[i].Price = data[0].Offers[0].OfferPrice[0].formattedPriceValue;
            console.log("Price: " + content[i].Price);
            for (var j = 0; j < data[0].VariationAttributes.length; j++) {
                if (data[0].VariationAttributes[j].name === "COLOR") {
                    content[i].Color = data[0].VariationAttributes[j].value;
                }
            }
            //content[i].Availability = data.inventoryAvailabilityMessage;
            //console.log("Availability: " + content[i].Availability);

            content[i].Rating = { Ease: Math.floor(Math.random() * 5 + 1), FabricFeel: Math.floor(Math.random() * 5 + 1), QualityOfFit: Math.floor(Math.random() * 5 + 1), Coolness: Math.floor(Math.random() * 5 + 1), Design: Math.floor(Math.random() * 5 + 1) };
            content[i].review = global.reviews[Math.floor(Math.random() * global.reviews.length)];
        }

        //console.log("Name: " + data.CatalogEntryView[0].title);
        //console.log("Price: " + data.CatalogEntryView[0].Offers[0].OfferPrice[0].formattedPriceValue);

        res.send(content);

        //Now to return content to Andrew for him to handle...

    });//end client.get();
});

//ProductList controller action
router.get('/productList', function (req, res, next) {
    //Make some calls to target's API!
    console.log("in the product list!");
    console.log("res: " + res);

    //var categoryId = req.param('cid'); //categoryId is the ID that the user clicks on. expecting from andrizzle

    var categoryName = req.param("category"); //take the category name and match it up to the appropriate categoryId.
    console.log("categoryName: " + categoryName);
    var categoryId = global.categories[categoryName];

    console.log("cid: " + categoryId);

    console.log("about to make the restful api call!");

    if (categoryId === null) {
        categoryId = 3675; //root level taxonomy
    }

    var resourceUri = "https://api.target.com/v2/products/search?categoryId=" + categoryId + "&key=J5PsS2XGuqCnkdQq0Let6RSfvU7oyPwF";

    console.log("resourceUri: " + resourceUri);

    client.get(resourceUri, function (data, response) {
        // parsed response body as js object
        console.log("data : " + data);
        // raw response
        console.log("response: " + response);

        data = data.CatalogEntryView;
        console.log(data);
        var content = []; //array of objects
        /*
         each object is an "item"
         each item has these properties:
         - DPCI
         - sizes
         - name

         if there's any extra "crap" on the different sizes, it's cut off.
         */

        if (data === null || data.length < 0) {
            res.status(404).send("There was an issue loading the category!");
        }

        for (var i = 0; i < data.length; i++) {//first level
            content[i] = {};
            content[i].DPCI = data[i].DPCI;

            for (var k = 0; k < data[i].ItemAttributes[0].Attribute.length; k++) {
                if (data[i].ItemAttributes[0].Attribute[k].name === "Size") {
                    content[i].sizes = data[i].ItemAttributes[0].Attribute[k].description;
                }
                if (data[i].ItemAttributes[0].Attribute[k].name === "ParentTitle") {
                    content[i].name = data[i].ItemAttributes[0].Attribute[k].description;
                }
            }

           content[i].price = data[i].Offers[0].OfferPrice[0].formattedPriceValue;
           content[i].image = data[i].fullImage;




            //fix the sizes array
            if (content[i].sizes !== undefined) {
                content[i].sizes = content[i].sizes.split(","); //turns string into array seperated by ","

                for (var j = 0; j < content[i].sizes.length; j++) {
                    if (content[i].sizes[j].indexOf("#") > 0) {   //checks to see if this string has extra crap
                        content[i].sizes[j] = content[i].sizes[j].substring(0, content[i].sizes[j].indexOf("#")); //grabs everything BEFORE the first index of #
                    }
                }
            }

            content[i].Rating = { Ease: Math.floor(Math.random() * 5 + 1), FabricFeel: Math.floor(Math.random() * 5 + 1), QualityOfFit: Math.floor(Math.random() * 5 + 1), Coolness: Math.floor(Math.random() * 5 + 1), Design: Math.floor(Math.random() * 5 + 1) };
            content[i].review = global.reviews[Math.floor(Math.random() * global.reviews.length)];


        }

        var height = 80;
        var waist = 30;
        var length = 32;
        var shirtSize = "M";
        var gender = "male";

        //Do some processing here to filter the products according to user information that I query from Mongo.

        User.find({"pants.waist": waist, gender: gender, "pants.length": length})
            .exec(function (err, resp) {
                console.log(err);
                console.log(resp);


                content


                res.send(content);
            });
        /*User.where('pants.waist').lte(waist + 2).gte(waist -2)
         .where('pants.length').lte(length +2).gte(waist -2)
         .where('shirtSize').equals(shirtSize)
         .where('gender').equals(gender).exec(function(err, res){
         console.log(err);
         console.log(res);
         });
         */
        //Also need to get Name, Price, and Radical Rating System
        //console.log(content);
        //used to be data -Braden

        //Here, go through and check all sizes pertaining to the user. 

    });//end client.get();

});

router.get('/promotion', function(req, res, next) {

});

router.get('/kick', function (req, res, next) {

    //Get a fixed, random list of DCIPs from Target
    var resourceUri = "https://api.target.com/v2/products/search?categoryId=3675&key=J5PsS2XGuqCnkdQq0Let6RSfvU7oyPwF";

    client.get(resourceUri, function (data, response) {
        var targetProducts = data.CatalogEntryView;
        console.log(targetProducts);
        var listOfDPCIs = [];

        for (var i = 0; i < targetProducts.length; i++) {
            listOfDPCIs[i] = targetProducts[i].DPCI;
        }

//        for(var j = 0; j < listOfDPCIs.length; j++) {
//            console.log(listOfDPCIs[j]);
//        }

        //code that adds reviews and products to each user in the db
        User.find({ "$or": [
            { "reviews": { "$size": 0}} ,
            { "reviews": null }
        ]}) //find all of the records where the reviews are null or empty
            .exec(function (err, resp) {
                console.log(resp);

                var listOfUserEmails = [];
                //for (var j = 0; i < )

                for (var i = 0; i < resp.length; i++) {
                    //use kick to create some fake reviews now...
                    var reviewToInsert = {
                        ProductId: listOfDPCIs[Math.floor(Math.random() * listOfDPCIs.length)],
                        Review: global.reviews[Math.floor(Math.random() * global.reviews.length)],
                        Rating: { Ease: Math.floor(Math.random() * 5 + 1), FabricFeel: Math.floor(Math.random() * 5 + 1), QualityOfFit: Math.floor(Math.random() * 5 + 1), Coolness: Math.floor(Math.random() * 5 + 1), Design: Math.floor(Math.random() * 5 + 1) }
                    };

                    //console.log(resp[i]);

                    resp[i].reviews.push(reviewToInsert);
                    console.log(resp[i]);

                    //User.update({ email: resp[i].email }, { $push : { reviews : reviewToInsert }});


                    resp[i].markModified('array');
                    resp[i].save();
//
                };

                //resp is all of the users with the similar height, waist, and pant length
            });
    });


    res.send({message: "KICK!"});
});

router.post('/register', function (req, res, next) {

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
        weight: req.param('weight'),
        reviews: []
    };


    var newUser = new User(userProperties);
    newUser.save(function (err) {
        if (err) return err;
        // saved!
        console.log("USER ADDED SUCCESSFULLY!");
        res.send({"message": "Success :)"});
    });


});

router.post('/test', function (req, res, next) {
    var test = req.param('test');
    console.log(test);
    res.send({test: test});
});

router.get('/login', function (req, res, next) {
    res.send({
        name: {
            first: "John",
            last: "Doe"
        },
        email: "john@stthomas.edu",
        gender: "male",
        height: 86,
        shirtSize: "M",
        pantsLength: 30,
        waist: 32,
        weight: 160
    });
});

router.post('/login', function (req, res, next) {
    var email = req.param('email');
    var password = req.param('password');


    console.log(req.body);
    //console.log("email: " + req.body.email);
    //console.log("password: " + req.body.password);

    res.send({"no": "no dice"});


    User.find({ email: email, password: password });
//    User.where('email').equals(email).exec(function(res){
//        console.log("inside callback:" + res);
//    });
});


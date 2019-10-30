var express = require('express');
var router = express.Router();
var Cart = require('../public/js/cart');

var DynamicsWebApi = require('dynamics-web-api');
var AuthenticationContext = require('adal-node').AuthenticationContext;
 
//the following settings should be taken from Azure for your application
//and stored in app settings file or in global variables
 
//OAuth Token Endpoint
var authorityUrl = 'https://login.microsoftonline.com/25d05c18-3fcc-4b94-b8f3-f892b43ec4e0/oauth2/token';
//CRM Organization URL
var resource = 'https://adncor.crm4.dynamics.com';
//Dynamics 365 Client Id when registered in Azure
var clientId = 'ec48cceb-a2b0-419e-aa0c-8d7630dc8155';
var username = 'adnd34501@adncor.onmicrosoft.com';
var password = 'azerTY1234@#$';
var clientSecret = 'zJ@LJ5UsJ8]20=muAPigqTL@_/5]RP21';

var adalContext = new AuthenticationContext(authorityUrl);






// adalContext.acquireTokenWithClientCredentials(resource, clientId, clientSecret, function(err, tokenResponse) {
//         if (err) {
//             console.log('well that didn\'t work: ' + err.stack);
//         } else {
//             console.log(tokenResponse);
//         }
//     });
//add a callback as a parameter for your function


function acquireToken(dynamicsWebApiCallback){
    //a callback for adal-node
    function adalCallback(error, token) {
        if (!error){
            //call DynamicsWebApi callback only when a token has been retrieved
            dynamicsWebApiCallback(token);
        }
        else{
            console.log('Token has not been retrieved. Error: ' + error.stack);
        }
    }

    adalContext.acquireTokenWithClientCredentials(resource, clientId, clientSecret, adalCallback);
}

console.log(acquireToken)
// acquireTokenWithUsernamePassword(resource, username, password, clientId, adalCallback)

// create DynamicsWebApi object
var dynamicsWebApi = new DynamicsWebApi({
    webApiUrl: 'https://adncor.crm4.dynamics.com/api/data/v9.0/',
    onTokenRefresh: acquireToken
});

dynamicsWebApi.executeUnboundFunction("WhoAmI").then(function (response) {
    console.log('Hello Dynamics 365! My id is: ' + response.UserId);
}).catch(function(error){
    console.log(error.message);
});
  
// dynamicsWebApi.retrieveAll("leads", ["fullname", "subject"], "statecode eq 0").then(function (response) {
 
//     var records = response.value;
//     console.log(records);
//     //do something else with a records array. Access a record: response.value[0].subject;
// })
// .catch(function (error){
//     //catch an error
//     console.log(error.message);
// });

var request = {
    collection: "products",
    select: ["name", "new_prix", "description", "producturl"],
    filter: "statecode eq 0",
    maxPageSize: 5,
    count: true
};

// dynamicsWebApi.retrieveMultipleRequest(request).then(function (response) {

//     // var records = response.value;
//     console.log(response.value);
//     //do something else with a records array. Access a record: response.value[0].subject;
// })
// .catch(function (error){
//     console.log(error.message);
// });



router.get('/', function (req, res, next) {
    var successMsg = req.flash('success')[0];
    dynamicsWebApi.retrieveMultipleRequest(request).then(function (response) {
        var count = response.oDataCount;
        // console.log(response.value);
        var nextLink = response.oDataNextLink;
        var records = response.value;
        //console.log(records);
        // var chunkSize = 3;
        // for (var i = 0; i < response.length; i += chunkSize) {
        //         records.push(response.slice(i, i + chunkSize));
        //     }
        res.render('homePage', {products: records, successMsg: successMsg, noMessages: !successMsg});
    })
    .catch(function (error){
        console.log(error.message);
    });
});




router.get('/product/:id', function(req, res, next) {
    var productId = req.params.id;

    //perform a retrieve operaion
    dynamicsWebApi.retrieve(productId, "products", ["name", "new_prix", "description", "producturl"]).then(function (record) {
        // var record = response.value;
        var myRecord = [record];
        req.session.myRecord = myRecord;
        // console.log(record);
        res.redirect('/product');

    })
    .catch(function (error) {
    //catch an error
    });
});

router.get('/add-to-cart/:id', function(req, res, next) {
    var productId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});

    //perform a retrieve operaion
    dynamicsWebApi.retrieve(productId, "products", ["name", "new_prix", "description", "producturl"]).then(function (record) {
        // var record = response.value;
        var myRecord = [record];

        cart.add(record, productId);
        req.session.cart = cart;
        console.log(req.session.cart);
        res.redirect('/product');

    })
    .catch(function (error) {
    //catch an error
    });
});




/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

// Routes
// router.get("/", function(request, response)  {
    
//     response.render('homePage');
// });


router.get("/cart", function(request, response)  {
    
    response.render("cart");
});
 
router.get("/auth", function(request, response)  {
    
    response.render("authPage");
});

router.get("/categories", function(request, response)  {
    
    response.render("categories");
});

router.get("/checkout", function(request, response)  {
    
    response.render("checkout");
});

router.get("/contact", function(request, response)  {
    
    response.render("contact");
});

router.get("/product", function(req, res)  { 
    res.render("product", {products : req.session.myRecord});
});


router.get('/shopping-cart', function(req, res, next) {
   if (!req.session.cart) {
       return res.render('cart', {products: null});
   } 
    var cart = new Cart(req.session.cart);
    console.log(cart.generateArray());
    res.render('cart', {products: cart.generateArray(), totalPrice: cart.totalPrice});
});

router.get('/reduce/:id', function(req, res, next) {
    var productId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});

    cart.reduceByOne(productId);
    req.session.cart = cart;
    res.redirect('/shopping-cart');
});

router.get('/remove/:id', function(req, res, next) {
    var productId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});

    cart.removeItem(productId);
    req.session.cart = cart;
    res.redirect('/shopping-cart');
});



module.exports = router;



[{ 
    name: 'MS Dynamics 365 license',
    price: null,
    description: 'Microsoft Dynamics 365 license  ',
    producturl:
     'https://1.bp.blogspot.com/-ZCGXlOoDxMI/WUQ8-Q0e_7I/AAAAAAAAAMk/Ct-TkEcYWQY                                                                                                                -ZsvosSmcfgKIyZ3RgAjzgCPcBGAYYCw/s1600/Dynamics.png',
    productid: '993f77d7-f3f3-e911-a812-000d3a4a1025' }]
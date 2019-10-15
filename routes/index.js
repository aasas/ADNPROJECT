var express = require('express');
var router = express.Router();

var DynamicsWebApi = require('dynamics-web-api');
var AuthenticationContext = require('adal-node').AuthenticationContext;
 
//the following settings should be taken from Azure for your application
//and stored in app settings file or in global variables
 
//OAuth Token Endpoint
var authorityUrl = 'https://login.microsoftonline.com/126c88aa-632c-4256-8604-60eeef899281/oauth2/token';
//CRM Organization URL
var resource = 'https://adnd36501.crm4.dynamics.com';
//Dynamics 365 Client Id when registered in Azure
var clientId = 'c3aac0bb-bbba-4b54-b907-86d55cea55f1';
var username = 'moustapha@adnd36501.onmicrosoft.com';
var password = 'azerTY1234@#$';
var clientSecret = '=aE/JweK.oQD0:NtP4wRI8E682e:aZl8';

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
    webApiUrl: 'https://adnd36501.crm4.dynamics.com/api/data/v9.0/',
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

// dynamicsWebApi.retrieveAll("products", ["name", "price", "description"], "statecode eq 0").then(function (response) {

//     // var records = response.value;
//     console.log(response.value);
//     //do something else with a records array. Access a record: response.value[0].subject;
// })
// .catch(function (error){
//     console.log(error.message);
// });


router.get('/', function (req, res, next) {
    dynamicsWebApi.retrieveAll("products", ["name", "price", "description"], "statecode eq 0").then(function (response) {

    var records = response.value;
    // var chunkSize = 3;
    // for (var i = 0; i < response.length; i += chunkSize) {
    //         records.push(response.slice(i, i + chunkSize));
    //     }
    res.render('homePage', {products: records});
    })
    .catch(function (error){
        console.log(error.message);
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

router.get("/product", function(request, response)  {
    
    response.render("product");
});


module.exports = router;

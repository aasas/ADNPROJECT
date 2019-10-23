var express = require('express');
var router = express.Router();

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
    select: ["name", "price", "description", "producturl"],
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
    dynamicsWebApi.retrieveMultipleRequest(request).then(function (response) {
        var count = response.oDataCount;
        console.log(response.value);
        var nextLink = response.oDataNextLink;
        var records = response.value;
        //console.log(records);
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




router.get('/product/:id', function(req, res, next) {
    var productId = req.params.id;

    //perform a retrieve operaion
    dynamicsWebApi.retrieve(productId, "products", ["name", "price", "description", "producturl"]).then(function (record) {
        // var record = response.value;
        var myRecord = [record];
        // console.log(record);
        res.render('product', {products: myRecord});

    })
    .catch(function (error) {
    //catch an error
    });
});

// productId = '993f77d7-f3f3-e911-a812-000d3a4a1025';
// dynamicsWebApi.retrieve(productId, "products", ["name", "price", "description", "producturl"]).then(function (record) {
//         // var record = response.value;
//         var myRecord = [record];
//         // record = JSON.parse(record);
//         console.log(myRecord);

//     })
//     .catch(function (error) {
//     //catch an error
//     });




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
    var myRecord = [{ 
    name: 'MS Dynamics 365 license',
    price: '$233',
    description: 'Microsoft Dynamics 365 license  ',
    producturl:
     'https://1.bp.blogspot.com/-ZCGXlOoDxMI/WUQ8-Q0e_7I/AAAAAAAAAMk/Ct-TkEcYWQY                                                                                                                -ZsvosSmcfgKIyZ3RgAjzgCPcBGAYYCw/s1600/Dynamics.png',
    productid: '993f77d7-f3f3-e911-a812-000d3a4a1025' }]
    response.render("product", {products : myRecord});
});


module.exports = router;



[{ 
    name: 'MS Dynamics 365 license',
    price: null,
    description: 'Microsoft Dynamics 365 license  ',
    producturl:
     'https://1.bp.blogspot.com/-ZCGXlOoDxMI/WUQ8-Q0e_7I/AAAAAAAAAMk/Ct-TkEcYWQY                                                                                                                -ZsvosSmcfgKIyZ3RgAjzgCPcBGAYYCw/s1600/Dynamics.png',
    productid: '993f77d7-f3f3-e911-a812-000d3a4a1025' }]
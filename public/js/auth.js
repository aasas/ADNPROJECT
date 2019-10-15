var DynamicsWebApi = require('dynamics-web-api');
var AuthenticationContext = require('adal-node').AuthenticationContext;
 
//the following settings should be taken from Azure for your application
//and stored in app settings file or in global variables
 
//OAuth Token Endpoint
var authorityUrl = 'https://login.microsoftonline.com/organizations/oauth2/v2.0/token';
//CRM Organization URL
var resource = 'https://adnd36501.crm.dynamics.com';
//Dynamics 365 Client Id when registered in Azure
var clientId = '19806a61-4bb5-4163-a7d4-a9556a42c713';
var username = 'crm-user-name';
var password = 'crm-user-password';
 
var adalContext = new AuthenticationContext(authorityUrl);
 
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
 
    //call a necessary function in adal-node object to get a token
    adalContext.acquireTokenWithUsernamePassword(resource, username, password, clientId, adalCallback);
}
 
//create DynamicsWebApi object
var dynamicsWebApi = new DynamicsWebApi({
    webApiUrl: 'https://adnd36501.api.crm.dynamics.com/api/data/v9.0/',
    onTokenRefresh: acquireToken
});
 
//call any function
dynamicsWebApi.executeUnboundFunction("WhoAmI").then(function (response) {
    console.log('Hello Dynamics 365! My id is: ' + response.UserId);
}).catch(function(error){
    console.log(error.message);
});
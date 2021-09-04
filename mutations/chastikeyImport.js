const { AuthenticationError, UserInputError, ApolloError } = require('apollo-server-express');
const fetch = require("node-fetch");
const fs = require('fs');

async function ChastikeyImport(inputs, models, req) {

    /* if (req.AppFound === false) {
        throw new AuthenticationError("App does not exist");
    }

    if (req.Authenticated === false) {
        throw new AuthenticationError("Session is not valid");
    }

    if(typeof inputs.CKUsername != "string") {
        throw new UserInputError("Username should be a String");
    }

    if(typeof inputs.TransferCode != "string") {
        throw new UserInputError("Transfer Code should be a String"); //They can start with a 0
    }

    const headers = {
        ClientID: process.env.Chastikey_Client,
        ClientSecret: process.env.Chastikey_Secret,
    }

    const params = {
        Username: inputs.CKUsername,
        Passcode: inputs.TransferCode
    };

    const options = {
        method: 'POST',
        body: JSON.stringify(params),
        headers  
    };

    const Response = await fetch('https://api.chastikey.com/v0.5/transferdata.php', options);
    const JSONData = await Response.json();
    
    const StringData = JSON.stringify(JSONData)
    
    //Writing a test JSON file to test without sending hundreds of requests to Chastikey
    await fs.writeFile("test.json", StringData, function(err) {
        if (err) {
        console.log(`File error: ${err}`);
        }
    }); */

    const JSONString = fs.readFileSync("../test.json");
    const JSONData = JSON.parse(JSONString.toString());
    
    console.log();

    if(JSONData.response.status != 200) {
        throw new ApolloError("Received an invalid response from Chastikey", 500);
    }

    const ThisUser = await models.User.findOne({
        where: {
            User_ID: req.Authenticated
        }
    });

    if(ThisUser.CK_Username != JSONData.userData.username) {
        throw new ApolloError(`Cannot import data from another user. Already imported from ${ThisUser.CK_Username}`, 400)
    }

    const DateJoinedChastikey = new Date(JSONData.userData.timestampJoined * 1000);

    /* ThisUser.set({
        CK_Username: JSONData.userData.username,
        Joined_CK_TimeStamp: DateJoinedChastikey,
        CK_UserID: JSONData.userData.id
    });
    ThisUser.save(); */



}
module.exports = ChastikeyImport;
ChastikeyImport({CKUsername: "Havok", TransferCode: "562626261"}, null, null)
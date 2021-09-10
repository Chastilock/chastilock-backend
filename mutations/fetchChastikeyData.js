const { AuthenticationError, UserInputError } = require('apollo-server-express');
const fetch = require("node-fetch");
const fs = require('fs');

async function fetchChastikeyData(inputs, models, req) {

    if (req.AppFound === false) {
        throw new AuthenticationError("App does not exist");
    }

    if (req.Authenticated === false) {
        throw new AuthenticationError("Session is not valid");
    }

    if(typeof inputs.CKUsername != "string") {
        throw new UserInputError("Username should be a String");
    }

    if(typeof inputs.TransferCode != "string") {
        throw new UserInputError("Transfer code should be a String"); //They can start with a 0
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

    console.log(JSONData)

    if(JSONData.response.status != 200) {
        throw new UserInputError("Something went wrong. It is likely the code is incorrect or has expired. Please try again.");
    }

    const AlreadyThere = await models.ChastikeyImport.findOne({
        Where: {
            Chastikey_Username: JSONData.userData.username
        }
    });

    if(AlreadyThere) {
        AlreadyThere.destroy();
    }
    
    const StringData = JSON.stringify(JSONData)

    const CurrentTime = new Date();
    const CurrentMillis = CurrentTime.getTime()
    const ExpiryTime = new Date(CurrentMillis + 1800000);

    const NumOfKeyheldLocks = JSONData.keyholderLocks.length;
    const NumOfLoadedLocks = JSONData.lockeeLocks.length;
    
    const AverageKeyholderRating = `${JSONData.keyholderData.averageRating} / ${JSONData.keyholderData.noOfKeyholderRatings} ratings`
    const AverageLockeeRating = `${JSONData.lockeeData.averageLockeeRating} / ${JSONData.lockeeData.noOfLockeeRatings} ratings`

    let KeyholdersMovedOver = true;

   for (const i of JSONData.lockeeLocks) {
    console.log(i.keyholderID)
        if(i.keyholderID != 0) {
            const CheckForKH = await models.User.findOne({
                where: {
                    CK_UserID: i.keyholderID
                }
            });
            
            if(CheckForKH != true) {
                KeyholdersMovedOver = false;
            }
        }
    };

    return models.ChastikeyImport.create({
        User_ID: req.Authenticated,
        Chastikey_Username: JSONData.userData.username,
        Expires: ExpiryTime,
        Started: CurrentTime,
        Data: StringData,
        NumOfKeyholderLocks: NumOfKeyheldLocks,
        NumOfLockeeLocks: NumOfLoadedLocks,
        AverageLockeeRating: AverageLockeeRating,
        AverageKeyholderRating: AverageKeyholderRating,
        Keyholders_Moved_Over: KeyholdersMovedOver
    });
}
module.exports = fetchChastikeyData;
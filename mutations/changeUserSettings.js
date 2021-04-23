const { AuthenticationError, ApolloError } = require('apollo-server-express');
async function changeUserSettings(inputs, models, req) {

    if (req.AppFound === false) {
        throw new AuthenticationError("App does not exist");
    }

    if (req.Authenticated === false) {
        throw new AuthenticationError("Session is not valid");
    }

    const SettingsSearch = await models.UserSetting.findOne({
        where: {
            User_ID: req.Authenticated
        }
    })
    if(!SettingsSearch) {
        throw new ApolloError("Something went wrong retrieving exisiting settings!")
    }

    const data = {
        Allow_Duplicate_Characters: inputs.Allow_Duplicate_Characters,
        Show_Combo_To_Keyholder: inputs.Show_Combo_To_Keyholder,
        Share_Stats: inputs.Share_Stats     
    }
    SettingsSearch.set(data);
    SettingsSearch.save();
    return SettingsSearch;
}
module.exports = changeUserSettings;
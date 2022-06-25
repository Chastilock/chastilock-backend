const { initializeApp, applicationDefault } = require('firebase-admin/app');
const { Session } = require("../models");
const { Sequelize } = require('sequelize');
const Op = Sequelize.Op

initializeApp({
    credential: applicationDefault()
});


async function NotifyAllUsers(body, data) {

    let messages = [];
    const Tokens = await Session.findAll({
        where: {
            Notification_Token: {
                [Op.ne]: null
            }
        }
    });

    for(let Token of Tokens) {
        
        messages.push({
            token: Token,
            body,
            data
        })
    }

    sendMessages(messages);
}

async function addMessagesForSingleUser(UserID, messages, body, data) {

    const Tokens = await Session.findAll({
        where: {
            Notification_Token: {
                [Op.ne]: null,
                User_ID: UserID
            }
        }
    });

    for(let Token of Tokens) {
        messages.push({
            to: Token,
            sound: 'default',
            body,
            data
        });
    }
    return messages;
}


function sendMessages(messages) {
    //Need to split the messages into chuncks of no more than 500

    getMessaging().sendAll(messages).then((response) => {
        console.log(response.successCount + ' messages were sent successfully');
    });
}

function checkNotificationToken(Token) {
    if(Expo.isExpoPushToken(Token)) {
        return true;
    } else {
        return false
    }
}

module.exports = {
    NotifyAllUsers,
    sendMessages,
    checkNotificationToken,
    addMessagesForSingleUser
}
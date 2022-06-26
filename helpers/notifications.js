const { initializeApp, applicationDefault } = require('firebase-admin/app');
const { getMessaging } = require('firebase-admin/messaging');
const { getAuth } = require('firebase-admin/auth');

const { Session } = require("../models");
const { Sequelize } = require('sequelize');
const Op = Sequelize.Op

initializeApp({
    credential: applicationDefault()
});


async function NotifyAllUsers(title, body) {

    let messages = [];
    const Tokens = await Session.findAll({
        where: {
            Notification_Token: {
                [Op.ne]: null
            }
        }
    });

    for(let Token of Tokens) {

        console.log()
        
        messages.push({
            notification: {
                title,
                body
            },
            token: Token.Notification_Token
        })
    }

    sendMessages(messages);
}

async function addMessagesForSingleUser(UserID, messages, title, body) {

    const Tokens = await Session.findAll({
        where: {
            Notification_Token: {
                [Op.ne]: null,
                User_ID: UserID
            }
        }
    });

    for(let Token of Tokens) {
        messages.push({notification: {
            title,
            body
        },
        token: Token.Notification_Token});
    }
    return messages;
}


function sendMessages(messages) {
    
    const chunkSize = 500;
    for (let i = 0; i < messages.length; i += chunkSize) {
        const chunk = messages.slice(i, i + chunkSize);
   
        getMessaging().sendAll(chunk).then((response) => {
            console.log(response.successCount + ' messages were sent successfully');
        });
    }

}

async function checkNotificationToken(Token) {
    
    try {
        const result = await getAuth().verifyIdToken(Token);
        if (result) {
            return true;
        }
        return false;
    } catch(e) {
        return false;
    }
}

module.exports = {
    NotifyAllUsers,
    sendMessages,
    checkNotificationToken,
    addMessagesForSingleUser
}
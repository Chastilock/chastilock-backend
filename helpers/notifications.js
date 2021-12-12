const { Expo } = require('expo-server-sdk');
const { Session } = require("../models");
const { Sequelize } = require('sequelize');
const Op = Sequelize.Op

let expo = new Expo({ accessToken: process.env.EXPO_ACCESS_TOKEN });

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
        
        if(!checkNotificationToken(Token)) {
            console.error(`Push token ${Token} is not a valid Expo push token`);
            continue;
        }

        messages.push({
            to: Token,
            sound: 'default',
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
    let chunks = expo.chunkPushNotifications(messages);
    let tickets = [];
    (async () => {
    // Send the chunks to the Expo push notification service. There are
    // different strategies you could use. A simple one is to send one chunk at a
    // time, which nicely spreads the load out over time:
        for (let chunk of chunks) {
            try {
                let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
                console.log(ticketChunk);
                tickets.push(...ticketChunk);
                // NOTE: If a ticket contains an error code in ticket.details.error, you
                // must handle it appropriately. The error codes are listed in the Expo
                // documentation:
                // https://docs.expo.io/push-notifications/sending-notifications/#individual-errors
            } catch (error) {
                console.error(error);
            }
        }
    })();
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
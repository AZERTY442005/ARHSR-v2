// ©2022 AZERTY. All rights Reserved | AZERTY#9999
const MessageLanguage = require("../Functions/MessageLanguage.js")
const fs = require("fs")
const fetch = require('node-fetch')
const yaml = require('js-yaml')
const {format: prettyFormat} = require('pretty-format')

function SendError(type, error, bot, config) {
    var URL = config.WebhookLogsURL
    fetch(URL, {
        "method":"POST",
        "headers": {
            "Content-Type": "application/json"
        },
        "body": JSON.stringify({
            "username": `${config["BotInfo"]["name"]} Logs`,
            "avatar_url": `${config["BotInfo"]["IconURL"]}`,
            "embeds": [
                {
                    "title": "__Error (AntiCrash)__",
                    "color": 15208739,
                    "timestamp": new Date(),
                    "footer": {"text": `${("0" + new Date().getHours()).slice(-2)}:${("0" + new Date().getMinutes()).slice(-2)}:${("0" + new Date().getSeconds()).slice(-2)} ${("0" + new Date().getDate()).slice(-2)}/${("0" + (new Date().getMonth()+1)).slice(-2)}/${new Date().getFullYear()}`},
                    "fields": [
                        {
                            "name": `${type}`,
                            "value": `${error}`,
                            "inline": false
                        }
                    ],
                }
            ]
        }
    )}).catch(()=>{});

    // console.log("bot.user: "+bot.user)
    // if(bot.user) {
    //     const OldStatus = bot.presence.status
    //     const OldActivities = bot.presence.activities
    //     bot.user.setPresence({
    //         status: "dnd",
    //         activities: [{
    //             name: "Error",
    //             type: "WATCHING",
    //         }]
    //     })
    //     setTimeout(() => {
    //         bot.user.setPresence({
    //             status: OldStatus,
    //             activities: OldActivities
    //         })
    //     }, 2500);
    // }
    
}

module.exports = async (bot, config) => {
    // console.log(bot)
    // console.log(bot.user)
    process.on("unhandledRejection", (reason, p) => {
        console.error(" [AntiCrash] :: Unhandled Rejection/Catch");
        console.log(reason, p);
        SendError("Unhandled Rejection/Catch", prettyFormat(reason), bot, config)
    });
    process.on("uncaughtException", (err, origin) => {
        console.error(" [AntiCrash] :: Uncaught Exception/Catch");
        console.log(err, origin);
        SendError("Uncaught Exception/Catch", prettyFormat(err), bot, config)
    });
    process.on("uncaughtExceptionMonitor", (err, origin) => {
        console.error(" [AntiCrash] :: Uncaught Exception/Catch (MONITOR)");
        console.log(err, origin);
        SendError("Uncaught Exception/Catch (MONITOR)", prettyFormat(err), bot, config)
    });
    process.on("multipleResolves", (type, promise, reason) => {
        // console.error(" [AntiCrash] :: Multiple Resolves");
        // console.log(type, promise, reason);
        // SendError("Multiple Resolves", prettyFormat(type), bot, config)
    });
};

// ©2022 AZERTY. All rights Reserved | AZERTY#9999
// const MessageLanguage = require("../Functions/MessageLanguage.js")
const fs = require('fs')
// const yaml = require('js-yaml')
// const fetch = require('node-fetch')

module.exports = async (bot, config) => {
    const eventElements = fs.readdirSync('./Events')
    for (const element of eventElements) {
        // console.log("element.includes('.'): "+element+": "+element.includes('.'))

        // TO UPGRADE
        if(!element.includes('.')) { // If element is a Folder
            const folder = fs.readdirSync(`./Events/${element}`)
            for (const file of folder) {
                const event = require(`../Events/${element}/${file}`);
                if (event.once) {
                    bot.once(event.name, (...args) => event.execute(...args, bot, config));
                } else {
                    bot.on(event.name, (...args) => event.execute(...args, bot, config));
                }
                // console.log(event)
            }
        } else {
            const event = require(`../Events/${element}`);
            if (event.once) {
                bot.once(event.name, (...args) => event.execute(...args, bot, config));
            } else {
                bot.on(event.name, (...args) => event.execute(...args, bot, config));
            }
            // console.log(event)
        }
    }
}
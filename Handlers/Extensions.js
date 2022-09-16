// ©2022 AZERTY. All rights Reserved | AZERTY#9999
// const MessageLanguage = require("../Functions/MessageLanguage.js")
const fs = require('fs')
// const yaml = require('js-yaml')
// const fetch = require('node-fetch')

module.exports = async (bot, config) => {
    const extensionFiles = fs.readdirSync('./Extensions').filter(file => file.endsWith('.js'))
    for (const file of extensionFiles) { // Read Events
        const extension = require(`../Extensions/${file}`);
        extension(bot, config)
    }
}
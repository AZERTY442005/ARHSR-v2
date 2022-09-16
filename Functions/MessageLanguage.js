// ©2022 AZERTY. All rights Reserved | AZERTY#9999
// const MessageLanguage = require("../Functions/MessageLanguage.js")
// const { MessageEmbed } = require("discord.js")
const fs = require("fs")
const yaml = require('js-yaml')

module.exports = (ID, bot, guildID) => {
    let config = yaml.load(fs.readFileSync("./config.yaml", "utf8"))
    let language
    if(guildID) {
        language = bot.languages.get(guildID)
    } else {
        language = `${config.DefaultLanguage}`
    }
    let message_language = yaml.load(fs.readFileSync("./message-language.yaml", "utf8"))

    const text = `message_language["${language}"]["${ID}"]`.replace(".", "\"][\"")
    // console.log(text)

    return eval(text)
    
    
}

// ©2022 AZERTY. All rights Reserved | AZERTY#9999
const MessageLanguage = require("../Functions/MessageLanguage.js")
const { MessageEmbed } = require("discord.js")
const fs = require("fs")
// const fetch = require('node-fetch')
const yaml = require('js-yaml')
// const {format: prettyFormat} = require('pretty-format')
// const path = require('path')

module.exports = (permission, bot, message, filepath) => {
    let config = yaml.load(fs.readFileSync("./config.yaml", "utf8"))

    if(message.member.permissions.has(permission) || (message.author.id == config["CreatorID"] && fs.readFileSync("./DataBase/admin.txt", "utf8") == "on")) {
        // console.log("true")
        return true
    } else {
        // console.log("false")
        const Embed = new MessageEmbed()
        .setAuthor({name:`${message.author.tag}`, iconURL:message.author.displayAvatarURL({dynamic:true})})
        .setDescription(`:x: ${MessageLanguage("UserErrorNoPermissions", bot, message.guild.id)} (${MessageLanguage("Permissions", bot, message.guild.id)[permission]})`)
        .setColor("RED")
        message.reply({embeds:[Embed], allowedMentions:{repliedUser:false}})
        return false
    }
}

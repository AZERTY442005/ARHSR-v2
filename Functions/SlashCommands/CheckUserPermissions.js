// ©2022 AZERTY. All rights Reserved | AZERTY#9999
const MessageLanguage = require("../../Functions/MessageLanguage.js")
const { MessageEmbed } = require("discord.js")
const fs = require("fs")
// const fetch = require('node-fetch')
const yaml = require('js-yaml')
// const {format: prettyFormat} = require('pretty-format')
// const path = require('path')

module.exports = (permission, bot, interaction, filepath) => {
    let config = yaml.load(fs.readFileSync("./config.yaml", "utf8"))

    if(interaction.member.permissions.has(permission) || (interaction.user.id == config["CreatorID"] && fs.readFileSync("./DataBase/admin.txt", "utf8") == "on")) {
        // console.log("true")
        return true
    } else {
        // console.log("false")
        const Embed = new MessageEmbed()
        .setAuthor({name:`${interaction.user.tag}`, iconURL:interaction.user.displayAvatarURL({dynamic:true})})
        .setDescription(`:x: ${MessageLanguage("UserErrorNoPermissions", bot, interaction.guild.id)} (${MessageLanguage("Permissions", bot, interaction.guild.id)[permission]})`)
        .setColor("RED")
        interaction.reply({embeds:[Embed], ephemeral:true})
        return false
    }
}

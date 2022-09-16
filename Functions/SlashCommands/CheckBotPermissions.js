// ©2022 AZERTY. All rights Reserved | AZERTY#9999
const MessageLanguage = require("../../Functions/MessageLanguage.js")
const { MessageEmbed } = require("discord.js")
const fs = require("fs")
// const fetch = require('node-fetch')
const yaml = require('js-yaml')
// const {format: prettyFormat} = require('pretty-format')
// const path = require('path')
const mongo = require('../../Functions/Mongo')
const LanguagesSchema = require("../../DataBase/schemas/languages-schema")

// module.exports = async (permission, bot, interaction, filepath, ephemeral) => {
module.exports = async (permission, bot, interaction, filepath) => {
    if(interaction.guild.me.permissions.has(permission)) {
        // console.log("true")
        return true
    } else {
        // console.log("false")
        const Embed = new MessageEmbed()
        .setAuthor({name:`${interaction.user.tag}`, iconURL:interaction.user.displayAvatarURL({dynamic:true})})
        .setDescription(`:x: ${MessageLanguage("MeErrorNoPermissions", bot, message.guild.id)} (${MessageLanguage("Permissions", bot, message.guild.id)[permission]})`)
        .setColor("RED")
        // interaction.reply({embeds:[Embed], ephemeral:ephemeral?ephemeral:true})
        interaction.reply({embeds:[Embed], ephemeral:true})
        return false
    }
}

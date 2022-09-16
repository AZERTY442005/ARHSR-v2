// ©2022 AZERTY. All rights Reserved | AZERTY#9999
const MessageLanguage = require("../Functions/MessageLanguage.js")
const { MessageEmbed } = require("discord.js")
// const fs = require("fs")
// const fetch = require('node-fetch')
// const yaml = require('js-yaml')
// const {format: prettyFormat} = require('pretty-format')
// const path = require('path')

module.exports = (permission, bot, message, filepath) => {
    const Embed = new MessageEmbed()
    .setAuthor({name:`${message.author.tag}`, iconURL:message.author.displayAvatarURL({dynamic:true})})
    // .setDescription(`:x: Vous n'avez pas les permissions de faire ceci (${permission})`)
    .setDescription(`:x: ${MessageLanguage("UserErrorNoPermissions", bot, message.guild.id)} (${MessageLanguage("Permissions", bot, message.guild.id)[permission]})`)
    // .addField(`:x: **${error}**`, `:arrow_right: ${prefix}${command.usage}`)
    .setColor("RED")
    // .setTimestamp()
    // message.channel.send({embeds:[Embed]})
    message.reply({embeds:[Embed], allowedMentions:{repliedUser:false}}).catch(err=>{if(err=="DiscordAPIError: Missing Permissions") message.guild.channels.cache.find(channel => channel.type === 'text' && channel.permissionsFor(message.guild.me).has('SEND_MESSAGES')).send(message.author,new MessageEmbed().setTitle(`:x: ${MessageLanguage("UserErrorNoPermissions", bot, message.guild.id)} (${MessageLanguage("Permissions", bot, message.guild.id)[permission]})`).setDescription(`:x: ${MessageLanguage("Error", bot, message.guild.id)["CantRespondYou"]} <#${message.channel.id}>`).setAuthor({name:`${message.author.tag}`, iconURL:message.author.displayAvatarURL({dynamic:true})}).setColor("RED"))})
}

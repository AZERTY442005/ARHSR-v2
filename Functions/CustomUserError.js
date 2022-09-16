// ©2022 AZERTY. All rights Reserved | AZERTY#9999
const MessageLanguage = require("../Functions/MessageLanguage.js")
const { MessageEmbed } = require("discord.js")
// const fs = require("fs")
// const fetch = require('node-fetch')
// const yaml = require('js-yaml')
// const {format: prettyFormat} = require('pretty-format')
// const path = require('path')

module.exports = (error, usage, bot, message, filepath, MP) => {
    const prefix = bot.prefixes.get(message.guild.id)


    const Embed = new MessageEmbed()
    .setAuthor({name:`${message.author.tag}`, iconURL:message.author.displayAvatarURL({dynamic:true})})
    // .addField(`:x: **${error}**`, `__Usage:__ ${prefix}${usage}`)
    // .addField(`:x: **${MessageLanguage("CustomUserError", bot, message.guild.id)[error]}**`, `__Usage:__ ${prefix}${usage}`)
    .addField(`:x: **${MessageLanguage("UserError", bot, message.guild.id)[error]}**`, `__Usage:__ ${prefix}${usage}`)
    // .addField(`:x: **${error}**`, `:arrow_right: ${prefix}${command.usage}`)
    .setColor("RED")
    // .setTimestamp()
    // message.channel.send({embeds:[Embed]})
    if(MP) message.author.send({embeds:[Embed]}).catch(err=>{if(err=="DiscordAPIError: Missing Permissions") message.guild.channels.cache.find(channel => channel.type === 'text' && channel.permissionsFor(message.guild.me).has('SEND_MESSAGES')).send(message.author,new MessageEmbed().setDescription(`:x: ${MessageLanguage("Error", bot, message.guild.id)["CantRespondYou"]} <#${message.channel.id}>`).setAuthor({name:`${message.author.tag}`, iconURL:message.author.displayAvatarURL({dynamic:true})}).setColor("RED").addField(`:x: **${MessageLanguage("CustomUserError", bot, message.guild.id)[error]}**`, `__Usage:__ ${prefix}${usage}`))})
    else message.reply({embeds:[Embed], allowedMentions:{repliedUser:false}}).catch(()=>{})
}

// ©2022 AZERTY. All rights Reserved | AZERTY#9999
const MessageLanguage = require("../Functions/MessageLanguage.js")
const { MessageEmbed } = require("discord.js")
// const fs = require("fs")
// const fetch = require('node-fetch')
// const yaml = require('js-yaml')
// const {format: prettyFormat} = require('pretty-format')
// const path = require('path')

module.exports = (msg, bot, message, filepath) => {
    const Index = msg.split(" ").shift()
    const args = msg.substr(msg.indexOf(" ") + 1).split(" ")
    for(let i=0;i<args.length;i++) {
        while(args[i].includes("_")) args[i] = args[i].replace("_", " ")
    }
    let sent = MessageLanguage("Success", bot, message.guild.id)[Index]
    .replace("{0}", `${!args[0]?"":args[0]}`)
    .replace("{1}", `${!args[1]?"":args[1]}`)
    .replace("{2}", `${!args[2]?"":args[2]}`)
    .replace("{3}", `${!args[3]?"":args[3]}`)
    .replace("{4}", `${!args[4]?"":args[4]}`)
    const Embed = new MessageEmbed()
    .setAuthor({name:`${message.author.tag}`, iconURL:message.author.displayAvatarURL({dynamic:true})})
    // .setDescription(`:white_check_mark: ${msg}`)
    .setDescription(`:white_check_mark: ${sent}`)
    .setColor("GREEN")
    message.reply({embeds:[Embed], allowedMentions:{repliedUser:false}}).catch(err => {
        // message.reply({embeds:[Embed], allowedMentions:{repliedUser:false}}).catch(()=>{})
        message.channel.send({embeds:[Embed]}).catch(err=>{if(err=="DiscordAPIError: Missing Permissions") message.guild.channels.cache.find(channel => channel.type === 'text' && channel.permissionsFor(message.guild.me).has('SEND_MESSAGES')).send(message.author,new MessageEmbed().setTitle(`:white_check_mark: ${sent}`).setDescription(`:x: ${MessageLanguage("Error", bot, message.guild.id)["CantRespondYou"]} <#${message.channel.id}>`).setAuthor({name:`${message.author.tag}`, iconURL:message.author.displayAvatarURL({dynamic:true})}).setColor("GREEN"))})
    })
}

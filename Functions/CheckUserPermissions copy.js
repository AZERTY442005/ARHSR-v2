// ©2022 AZERTY. All rights Reserved | AZERTY#9999
const MessageLanguage = require("../Functions/MessageLanguage.js")
const { MessageEmbed } = require("discord.js")
const fs = require("fs")
const fetch = require('node-fetch')
const yaml = require('js-yaml')
const {format: prettyFormat} = require('pretty-format')
const path = require('path')

// const mongoose = require("mongoose")
// const mongo = require('../Functions/Mongo.js')
// const BotSchema = require("../DataBase/schemas/bot-schema.js");

module.exports = async (permission, bot, message, filepath) => {
    let config = yaml.load(fs.readFileSync("./config.yaml", "utf8"))
    const filename = path.basename(filepath).slice(0, -3)
    let command = new Object()
    Array.from(bot.commands).forEach(element => {
        // console.log(command.name)
        console.log(element[1])
        if(element.name==filename) command = element
    });
    let languages = JSON.parse(fs.readFileSync("./DataBase/languages.json", "utf8"));
    // let message_language = JSON.parse(fs.readFileSync("./DataBase/message-language.json", "utf8"))
    let message_language = yaml.load(fs.readFileSync("./message-language.yaml", "utf8"));
    if(!languages[message.guild.id]) {
        languages[message.guild.id] = "en"
    }

    // CUSTOM ROLE PERMISSIONS SOON
    
    // console.log("message.member.permissions.has(permission): "+message.member.permissions.has(permission))
    // console.log('(message.author.id == config["CreatorID"] && fs.readFileSync("./DataBase/admin.txt", "utf8") == "on"): '+(message.author.id == config["CreatorID"] && fs.readFileSync("./DataBase/admin.txt", "utf8") == "on"))
    if(message.member.permissions.has(permission) || (message.author.id == config["CreatorID"] && fs.readFileSync("./DataBase/admin.txt", "utf8") == "on")) {
    // if(message.member.permissions.has(permission) || (message.author.id == config["CreatorID"] && BotDB.get("admin") == "on")) {
        // console.log("true")
        return true
    } else {
        // console.log("false")
        const Embed = new MessageEmbed()
        .setAuthor({name:`${message.author.tag}`, iconURL:message.author.displayAvatarURL({dynamic:true})})
        .setDescription(`:x: ${MessageLanguage("UserErrorNoPermissions", bot, message.guild.id)} (${MessageLanguage("Permissions", bot, message.guild.id)[permission]})`)
        .setColor("RED")
        message.reply({embeds:[Embed], allowedMentions:{repliedUser:false}}).catch(err=>{if(err=="DiscordAPIError: Missing Permissions") message.guild.channels.cache.find(channel => channel.type === 'text' && channel.permissionsFor(message.guild.me).has('SEND_MESSAGES')).send(message.author,new MessageEmbed().setTitle(`:x: ${MessageLanguage("UserErrorNoPermissions", bot, message.guild.id)} (${MessageLanguage("Permissions", bot, message.guild.id)[permission]})`).setDescription(`:x: ${MessageLanguage("Error", bot, message.guild.id)["CantRespondYou"]} <#${message.channel.id}>`).setAuthor({name:`${message.author.tag}`, iconURL:message.author.displayAvatarURL({dynamic:true})}).setColor("RED"))})
        return false
    }

    // await mongo().then(async (mongoose) => {
    //     try {
            // let result = await BotSchema.findOne({key:`admin`})
            // if(!result) {
            //     await new BotSchema({key:`admin`, value:"off"}).save()
            //     result = await BotSchema.findOne({key:`admin`})
            // }

            // if(message.member.permissions.has(permission) || (message.author.id == config["CreatorID"] && result.value == "on")) {
            // if(message.member.permissions.has(permission) || (message.author.id == config["CreatorID"])) {
            //     console.log("true")
            //     return true
            // } else {
            //     console.log("false")
            //     const Embed = new MessageEmbed()
            //     .setAuthor({name:`${message.author.tag}`, iconURL:message.author.displayAvatarURL({dynamic:true})})
            //     .setDescription(`:x: ${MessageLanguage("UserErrorNoPermissions", bot, message.guild.id)} (${MessageLanguage("Permissions", bot, message.guild.id)[permission]})`)
            //     .setColor("RED")
            //     message.reply({embeds:[Embed], allowedMentions:{repliedUser:false}}).catch(err=>{if(err=="DiscordAPIError: Missing Permissions") message.guild.channels.cache.find(channel => channel.type === 'text' && channel.permissionsFor(message.guild.me).has('SEND_MESSAGES')).send(message.author,new MessageEmbed().setTitle(`:x: ${MessageLanguage("UserErrorNoPermissions", bot, message.guild.id)} (${MessageLanguage("Permissions", bot, message.guild.id)[permission]})`).setDescription(`:x: ${MessageLanguage("Error", bot, message.guild.id)["CantRespondYou"]} <#${message.channel.id}>`).setAuthor({name:`${message.author.tag}`, iconURL:message.author.displayAvatarURL({dynamic:true})}).setColor("RED"))})
            //     return false
            // }
    //     } finally {
    //         mongoose.connection.close()
    //     }
    // })
}

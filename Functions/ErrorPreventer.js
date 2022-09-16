// ©2022 AZERTY. All rights Reserved | AZERTY#9999
const MessageLanguage = require("../Functions/MessageLanguage.js")
const { MessageEmbed } = require("discord.js")
const fs = require("fs")
const fetch = require('node-fetch')
const yaml = require('js-yaml')

module.exports = (error, message, bot) => {
    let config = yaml.load(fs.readFileSync("./config.yaml", "utf8"))
    let languages = JSON.parse(fs.readFileSync("./DataBase/languages.json", "utf8"));
    let message_language = yaml.load(fs.readFileSync("./message-language.yaml", "utf8"));
    if(!languages[message.guild.id]) {
        languages[message.guild.id] = "en"
    }

    var URL = config.WebhookLogsURL
    fetch(URL, {
        "method":"POST",
        "headers": {
            "Content-Type": "application/json"
        },
        "body": JSON.stringify({
            "username": `${config["BotInfo"]["name"]} Logs`,
            "avatar_url": `${config["BotInfo"]["IconURL"]}`,
            "embeds": [
                {
                    "title": "__Error__",
                    "color": 15208739,
                    "timestamp": new Date(),
                    "footer": {"text": `${("0" + new Date().getHours()).slice(-2)}:${("0" + new Date().getMinutes()).slice(-2)}:${("0" + new Date().getSeconds()).slice(-2)} ${("0" + new Date().getDate()).slice(-2)}/${("0" + (new Date().getMonth()+1)).slice(-2)}/${new Date().getFullYear()}`},
                    "author": {
                        "name": `${message.author.username}`,
                        "icon_url": `${message.author.displayAvatarURL({dynamic:true})}`
                    },
                    "fields": [
                        {
                            "name": `User`,
                            "value": `${message.author}`,
                            "inline": false
                        },
                        {
                            "name": "Server",
                            "value": `${message.guild.name}`,
                            "inline": false
                        },
                        {
                            "name": `Command`,
                            "value": `${message.content}`,
                            "inline": false
                        },
                        {
                            "name": `Error`,
                            "value": `${error}`,
                            "inline": false
                        }
                    ],
                }
            ]
        }
    )}).catch(()=>{});
    
    console.error(`${error}`)
    const Embed = new MessageEmbed()
    .setTitle(`${MessageLanguage("ErrorPreventer", bot, message.guild.id)}`)
    .setDescription(`${MessageLanguage("ErrorPreventerReportSent", bot, message.guild.id)}`)
    // .setAuthor({author:message.author.tag.toString(), iconURL:message.author.displayAvatarURL({dynamic:true})}).setColor("RED")
    .setAuthor({name:`${message.author.tag}`, iconURL:message.author.displayAvatarURL({dynamic:true})}).setColor("RED")
    .setTimestamp().setFooter({text:`${("0" + new Date().getHours()).slice(-2)}:${("0" + new Date().getMinutes()).slice(-2)}:${("0" + new Date().getSeconds()).slice(-2)} ${("0" + new Date().getDate()).slice(-2)}/${("0" + (new Date().getMonth()+1)).slice(-2)}/${new Date().getFullYear()}`})
    
    // message.channel.send({embeds:[Embed]}).catch(err=>{if(err=="DiscordAPIError: Missing Permissions") message.guild.channels.cache.find(channel => channel.type === 'text' && channel.permissionsFor(message.guild.me).has('SEND_MESSAGES')).send(message.author,new MessageEmbed().setTitle(`:x: ${sent}`).setDescription(`:x: ${MessageLanguage("Error", bot, message.guild.id)["CantRespondYou"]} <#${message.channel.id}>`).setAuthor({name:`${message.author.tag}`, iconURL:message.author.displayAvatarURL({dynamic:true})}).setColor("RED"))})
    // message.reply({embeds:[Embed], allowedMentions:{repliedUser:false}}).catch(err=>{if(err=="DiscordAPIError: Missing Permissions") message.guild.channels.cache.find(channel => channel.type === 'text' && channel.permissionsFor(message.guild.me).has('SEND_MESSAGES')).send(message.author,new MessageEmbed().setTitle(`:x: ${sent}`).setDescription(`:x: ${MessageLanguage("Error", bot, message.guild.id)["CantRespondYou"]} <#${message.channel.id}>`).setAuthor({name:`${message.author.tag}`, iconURL:message.author.displayAvatarURL({dynamic:true})}).setColor("RED"))})
    message.reply({embeds:[Embed], allowedMentions:{repliedUser:false}}).catch(err=>{if(err=="DiscordAPIError: Missing Permissions") message.guild.channels.cache.find(channel => channel.type === 'text' && channel.permissionsFor(message.guild.me).has('SEND_MESSAGES')).send(message.author,new MessageEmbed().setTitle(`:x: ${sent}`).setDescription(`:x: ${MessageLanguage("Error", bot, message.guild.id)["CantRespondYou"]} <#${message.channel.id}>`).setAuthor({name:`${message.author.tag}`, iconURL:message.author.displayAvatarURL({dynamic:true})}).setColor("RED"))})

    // console.log("bot.user: "+bot.user)
    // console.log(bot.presence)
    const OldStatus = bot.presence.status
    const OldActivities = bot.presence.activities
    if(bot.user) {
        bot.user.setPresence({
            status: "dnd",
            activities: [{
                name: "Error",
                type: "WATCHING",
            }]
        })
        setTimeout(() => {
            bot.user.setPresence({
                status: OldStatus,
                activities: OldActivities
            })
        }, 2500);
    }
}

// ©2022 AZERTY. All rights Reserved | AZERTY#9999
const MessageLanguage = require("../../../Functions/MessageLanguage.js")
const fs = require("fs")
const yaml = require("js-yaml")
const fetch = require("node-fetch")
const { MessageEmbed } = require("discord.js")
const Success = require("../../../Functions/SlashCommands/Success.js")

let config = yaml.load(fs.readFileSync("./config.yaml", "utf8"))
const FeedbackCooldown = new Set()
const CooldownDelay = config.Feedback_Cooldown

module.exports = {
    name: "Feedback",
    async execute(interaction, bot, config) {

        const ChannelMP = bot.channels.cache.get(interaction.message.reference.channelId) 
        const Message = await ChannelMP.messages.fetch(interaction.message.reference.messageId)
        // console.log(Message)

        if (FeedbackCooldown.has(interaction.user.id)) { // Command Cooldown
            const Embed = new MessageEmbed()
            .setAuthor({name:`${interaction.user.tag}`, iconURL:interaction.user.displayAvatarURL({dynamic:true})})
            .setDescription(`:alarm_clock: ${MessageLanguage("WaitFeedback", bot).replace("{delay}", CooldownDelay/60)}`)
            .setColor("ORANGE")
            interaction.reply({embeds:[Embed], ephemeral:true})
        } else {
            interaction.deferUpdate()
            var URL = config.WebhookLogsURL // Webhook Logs System
            fetch(URL, {
                "method":"POST",
                "headers": {"Content-Type": "application/json"},
                "body": JSON.stringify(
                    {
                        "username": `${config["BotInfo"]["name"]} Logs`,
                        "avatar_url": `${config["BotInfo"]["IconURL"]}`,
                        "content": `<@${config["CreatorID"]}>`,
                        "embeds": [
                        {
                            "title": "__Feedback__",
                            "color": 1752220,
                            "timestamp": new Date(),
                            "author": {
                                "name": `${interaction.user.username}`,
                                "icon_url": `${interaction.user.displayAvatarURL({dynamic:true})}`,
                            },
                            // "description": `${args.slice(0).join(" ")}`
                            "description": `${Message.content}`,
                            "fields": [
                                {
                                    "name": "User",
                                    "value": `${interaction.user} ${interaction.user.tag}`,
                                    "inline": false
                                }
                            ]
                        }
                        ]
                    }
                )
            })
            .catch(err => PassThrough)
            
            // Success("SentSuccess", bot, interaction, __filename, false, true, "fr")
            const Embed = new MessageEmbed()
            .setDescription(":white_check_mark: Feedback envoyé. Merci de votre commentaire")
            .setAuthor({name:`${interaction.user.tag}`, iconURL:interaction.user.displayAvatarURL({dynamic:true})})
            .setColor("GREEN")
            .setTimestamp().setFooter({text:`${("0" + new Date().getHours()).slice(-2)}:${("0" + new Date().getMinutes()).slice(-2)}:${("0" + new Date().getSeconds()).slice(-2)} ${("0" + new Date().getDate()).slice(-2)}/${("0" + (new Date().getMonth()+1)).slice(-2)}/${new Date().getFullYear()}`})
            interaction.message.edit({embeds:[Embed], components:[]})

            // UPDATE COOLDOWN
            FeedbackCooldown.add(interaction.user.id)
            setTimeout(() => {
                FeedbackCooldown.delete(interaction.user.id)
            }, CooldownDelay*1000) // DELAY
        }
    }
}

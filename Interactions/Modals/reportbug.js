// ©2022 AZERTY. All rights Reserved | AZERTY#9999
const MessageLanguage = require("../../Functions/MessageLanguage.js")
const fs = require("fs")
const yaml = require("js-yaml")
const fetch = require("node-fetch")
const { MessageEmbed } = require("discord.js")
const Success = require("../../Functions/SlashCommands/Success.js")

let config = yaml.load(fs.readFileSync("./config.yaml", "utf8"))
const ReportBugCooldown = new Set()
const CooldownDelay = config.ReportBug_Cooldown

module.exports = {
    name: "reportbug",
    async execute(modal, bot, config) {
        const ReportBug = modal.getTextInputValue("reportbug")
        
        if (ReportBugCooldown.has(modal.user.id)) { // Command Cooldown
            const Embed = new MessageEmbed()
            .setAuthor({name:`${modal.user.tag}`, iconURL:modal.user.displayAvatarURL({dynamic:true})})
            .setDescription(`:alarm_clock: ${MessageLanguage("WaitReportBug", bot, modal.guild.id).replace("{delay}", CooldownDelay)}`)
            .setColor("ORANGE")
            modal.reply({embeds:[Embed], allowedMentions:{repliedUser:false}})
        } else {
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
                            "title": "__Bug Report__",
                            "color": 1752220,
                            "timestamp": new Date(),
                            "author": {
                                "name": `${modal.user.username}`,
                                "icon_url": `${modal.user.displayAvatarURL({dynamic:true})}`,
                            },
                            // "description": `${args.slice(0).join(" ")}`
                            "description": `${ReportBug}`,
                            "fields": [
                                {
                                    "name": "User",
                                    "value": `${modal.user} ${modal.user.tag}`,
                                    "inline": false
                                }
                            ]
                        }
                        ]
                    }
                )
            })
            .catch(err => PassThrough);
        
            Success("SentSuccess", bot, modal, __filename)
                    
            // UPDATE COOLDOWN
            ReportBugCooldown.add(modal.user.id);
            setTimeout(() => {
                ReportBugCooldown.delete(modal.user.id);
            }, CooldownDelay*1000); // DELAY
            // }, 1000); // TEMP
        }
    },
}

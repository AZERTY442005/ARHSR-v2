// ©2022 AZERTY. All rights Reserved | AZERTY#9999
const MessageLanguage = require("../Functions/MessageLanguage.js")
const Discord = require("discord.js");
const { MessageEmbed } = Discord
const fs = require('fs')
const yaml = require('js-yaml')
const fetch = require('node-fetch')

let config = yaml.load(fs.readFileSync("./config.yaml", "utf8"))
const mongo = require('../Functions/Mongo.js')
const StatisticsSchema = require("../DataBase/schemas/statistics-schema")
// const BotSchema = require("../DataBase/schemas/bot-schema.js")

module.exports = async (bot, config) => {

    bot.slashcommands = new Discord.Collection()

    // console.log("SlashCommands Handler Started")
    // READ COMMANDS
    const elements = fs.readdirSync('./Interactions/SlashCommands')
    for (const element of elements) {
        // console.log("element.includes('.'): "+element+": "+element.includes('.'))
        // TO UPGRADE
        if(!element.includes('.')) {
            const folder = fs.readdirSync(`./Interactions/SlashCommands/${element}`)
            for (const file of folder) {
                const slashcommand = require(`../Interactions/SlashCommands/${element}/${file}`);
                if(slashcommand.enabled) {
                    bot.slashcommands.set(slashcommand.name, slashcommand);
                    // console.log(slashcommand)
                }
            }
        } else {
            const slashcommand = require(`../Interactions/SlashCommands/${element}`);
            if(slashcommand.enabled) {
                bot.slashcommands.set(slashcommand.name, slashcommand);
                // console.log(slashcommand)
            }
        }
    }
    // console.log(bot.slashcommands)
    bot.slashcommands.sort((a, b) => a.name.localeCompare(b.name))



    bot.on("interactionCreate", async (interaction) => {
        if (!interaction.isCommand()) return
        
        // console.log("interactionCreate Handler")
        // console.log(interaction)

        if(!config.v13) return

        // IF BOT IS DISABLED
        let EmbedDisabled = new MessageEmbed()
        .setTitle(`Bot Disabled`)
        .setAuthor({name:`${interaction.user.tag}`, iconURL:interaction.user.displayAvatarURL({dynamic:true})})
        .setColor("RED")
        .addField(`For more informations, contact my developer at`, `AZERTY#9999`)
        .setTimestamp().setFooter({text:`${("0" + new Date().getHours()).slice(-2)}:${("0" + new Date().getMinutes()).slice(-2)}:${("0" + new Date().getSeconds()).slice(-2)} ${("0" + new Date().getDate()).slice(-2)}/${("0" + (new Date().getMonth()+1)).slice(-2)}/${new Date().getFullYear()}`})
        // console.log(bot.disabled)
        if(bot.disabled && interaction.commandName!="owner") return interaction.reply({embeds:[EmbedDisabled], ephemeral: true})
        // mongo().then(async (mongoose) => {
        //     try {
        //         let result = await BotSchema.findOne({key: "enabled"})
        //         if(!result) {
        //             await new BotSchema({key: "enabled", value:true}).save()
        //             result = await BotSchema.findOne({key: "enabled"})
        //         }
        //         console.log(result.value)
        //         if(result.value==="false") return interaction.reply({embeds:[EmbedDisabled], ephemeral: true})
        //     } finally {
        //         // mongoose.connection.close()
        //     }
        // })

        // IF USER IS BLACKLISTED
        let blacklist = JSON.parse(fs.readFileSync("./DataBase/blacklist.json", "utf8"));
        if(blacklist.includes(interaction.user.id)) {
            interaction.user.send(`${MessageLanguage("Blacklisted", bot, interaction.guild.id)}`)
            return
        }

        // DATAS SlashCommands
        mongo().then(async (mongoose) => {
            try {
                let result = await StatisticsSchema.findOne({type: "slashcommands"})
                if(!result) {
                    await new StatisticsSchema({type: "slashcommands", value:0}).save()
                    result = await StatisticsSchema.findOne({type: "slashcommands"})
                }
                result.value++
                await StatisticsSchema.findOneAndUpdate({type: "slashcommands"}, {value: result.value})
            } finally {}
        })

        // A FAIRE
        // console.log(interaction)
        // WEBHOOK LOGS SYSTEM
        var URL = config.WebhookLogsURL // Webhook Logs System
        if(bot.slashcommands.has(interaction.commandName)) fetch(URL, {
            "method":"POST",
            "headers": {"Content-Type": "application/json"},
            "body": JSON.stringify(
                {
                    "username": `${config.BotInfo.name} Logs`,
                    "avatar_url": `${config.BotInfo.IconURL}`,
                    "embeds": [
                        {
                            "title": "__SlashCommand executed__",
                            "color": 15258703,
                            "timestamp": new Date(),
                            "footer": {
                                "text": `${("0" + new Date().getHours()).slice(-2)}:${("0" + new Date().getMinutes()).slice(-2)}:${("0" + new Date().getSeconds()).slice(-2)} ${("0" + new Date().getDate()).slice(-2)}/${("0" + (new Date().getMonth()+1)).slice(-2)}/${new Date().getFullYear()}`
                            },
                            "author": {
                                "name": `${interaction.user.username}`,
                                "icon_url": `${interaction.user.displayAvatarURL({dynamic:true})}`,
                            },
                            "fields": [
                                {
                                    "name": "User",
                                    "value": `${interaction.user}`,
                                    "inline": false
                                },
                                {
                                    "name": "Server",
                                    "value": `${interaction.channel.type == "DM" || interaction.channel.type==="group"?`MP`:interaction.guild.name}`,
                                    "inline": false
                                },
                                {
                                    "name": "SlashCommand",
                                    // "value": `/${interaction.commandName}`,
                                    "value": `${interaction}`,
                                    "inline": false
                                }
                            ],
                        }
                    ]
                }
            )
        })
        .catch(err => PassThrough);

        // GET COMMAND
        execution = bot.slashcommands.get(interaction.commandName)||bot.slashcommands.find(cmd => cmd.aliases && cmd.aliases.includes(interaction.commandName))
        
        // IF THE BOT DON'T HAVE PERMISSIONS NEEDED
        for(const i in execution.permissions) {
            const permission = execution.permissions[i]
            if(!(interaction.channel.type == "DM" || interaction.channel.type==="group") && !interaction.channel.permissionsFor(interaction.guild.me).has(permission)) {
                interaction.reply({embeds:[
                    new MessageEmbed()
                    .setDescription(`:x: ${MessageLanguage("MeErrorInsufficientPermissions", bot, interaction.guild.id)} (${MessageLanguage("Permissions", bot, interaction.guild.id)[permission]})`)
                    .setAuthor({name:`${interaction.user.tag}`, iconURL:interaction.user.displayAvatarURL({dynamic:true})})
                    .setColor("RED")
                ], ephemeral:true})
                return
            }
        }

        // DOES THE COMMAND ALLOWS MP
        if((interaction.channel.type == "DM" || interaction.channel.type==="group") && !execution.MP) return interaction.reply({embeds:[
            new MessageEmbed()
            // .setDescription(`:x: ${MessageLanguage("UnavailableMPCommand", bot, interaction.guild.id)}`)
            .setDescription(`:x: This Command is not available in Private Messages`)
            .setAuthor({name:`${interaction.user.tag}`, iconURL:interaction.user.displayAvatarURL({dynamic:true})})
            .setColor("RED")
        ], ephemeral:true})

        // EXECUTE COMMAND
        execution.execute(interaction, bot, config)
    })
}

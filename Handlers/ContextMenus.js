// ©2022 AZERTY. All rights Reserved | AZERTY#9999
const MessageLanguage = require("../Functions/MessageLanguage.js")
const Discord = require("discord.js");
const { MessageEmbed } = Discord
const fs = require('fs')
const yaml = require('js-yaml')
// const fetch = require('node-fetch')

let config = yaml.load(fs.readFileSync("./config.yaml", "utf8"))
const mongo = require('../Functions/Mongo.js')
const StatisticsSchema = require("../DataBase/schemas/statistics-schema")
// const BotSchema = require("../DataBase/schemas/bot-schema.js");

module.exports = async (bot, config) => {

    bot.contextmenus = new Discord.Collection()

	const elements = fs.readdirSync('./Interactions/ContextMenus')
    for (const element of elements) {
        // console.log("element.includes('.'): "+element+": "+element.includes('.'))
        // TO UPGRADE
        if(!element.includes('.')) {
            const folder = fs.readdirSync(`./Interactions/ContextMenus/${element}`)
            for (const file of folder) {
                const contextmenu = require(`../Interactions/ContextMenus/${element}/${file}`);
				bot.contextmenus.set(contextmenu.name, contextmenu);
				// console.log(contextmenu)
            }
        } else {
            const contextmenu = require(`../Interactions/ContextMenus/${element}`);
			bot.contextmenus.set(contextmenu.name, contextmenu);
			// console.log(contextmenu)
        }
    }
	// console.log(bot.buttons)



    bot.on('interactionCreate', async (interaction) => {
		if (!interaction.isContextMenu()) return

		// console.log(interaction)

        if(!config.v13) return

		// IF BOT IS DISABLED
        let EmbedDisabled = new MessageEmbed()
            .setTitle(`Bot Disabled`)
            .setAuthor({name:`${interaction.user.tag}`, iconURL:interaction.user.displayAvatarURL({dynamic:true})})
            .setColor("RED")
            .addField(`For more informations, contact my developer at`, `AZERTY#9999`)
            .setTimestamp().setFooter({text:`${("0" + new Date().getHours()).slice(-2)}:${("0" + new Date().getMinutes()).slice(-2)}:${("0" + new Date().getSeconds()).slice(-2)} ${("0" + new Date().getDate()).slice(-2)}/${("0" + (new Date().getMonth()+1)).slice(-2)}/${new Date().getFullYear()}`})
        if(bot.disabled && interaction.commandName!="owner") return interaction.reply({embeds:[EmbedDisabled], ephemeral: true})

		// IF USER IS BLACKLISTED
        let blacklist = JSON.parse(fs.readFileSync("./DataBase/blacklist.json", "utf8"));
        if(blacklist.includes(interaction.user.id)) {
            // message.delete()
            interaction.user.send(`${MessageLanguage("Blacklisted", bot, message.guild.id)}`)
            return
        }
		
		// DATAS ContextMenus
        mongo().then(async (mongoose) => {
            try {
                let result = await StatisticsSchema.findOne({type: "contextmenu"})
                if(!result) {
                    await new StatisticsSchema({type: "contextmenu", value:0}).save()
                    result = await StatisticsSchema.findOne({type: "contextmenu"})
                }
                result.value++
                await StatisticsSchema.findOneAndUpdate({type: "contextmenu"}, {value: result.value})
            } finally {}
        })

        // Get Execution
        execution = bot.contextmenus.get(interaction.commandName)

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
        
        // Execute Associed ContextMenu
        if(execution) execution.execute(interaction, bot, config)

	})
}

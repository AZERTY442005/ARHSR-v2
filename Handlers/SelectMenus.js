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
const LanguagesSchema = require("../DataBase/schemas/languages-schema")
// const BotSchema = require("../DataBase/schemas/bot-schema.js");

module.exports = async (bot, config) => {

    bot.selectmenus = new Discord.Collection()

	const elements = fs.readdirSync('./Interactions/SelectMenus')
    for (const element of elements) {
        // console.log("element.includes('.'): "+element+": "+element.includes('.'))
        // TO UPGRADE
        if(!element.includes('.')) {
            const folder = fs.readdirSync(`./Interactions/SelectMenus/${element}`)
            for (const file of folder) {
                const selectmenu = require(`../Interactions/SelectMenus/${element}/${file}`);
				bot.selectmenus.set(selectmenu.name, selectmenu);
				// console.log(selectmenu)
            }
        } else {
            const selectmenu = require(`../Interactions/SelectMenus/${element}`);
			bot.selectmenus.set(selectmenu.name, selectmenu);
			// console.log(selectmenu)
        }
    }
	// console.log(bot.selectmenus)



    bot.on('interactionCreate', async (interaction) => {
		if (!interaction.isSelectMenu()) return

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
		
		// DATAS SelectMenus
        mongo().then(async (mongoose) => {
            try {
                let result = await StatisticsSchema.findOne({type: "selectmenu"})
                if(!result) {
                    await new StatisticsSchema({type: "selectmenu", value:0}).save()
                    result = await StatisticsSchema.findOne({type: "selectmenu"})
                }
                result.value++
                await StatisticsSchema.findOneAndUpdate({type: "selectmenu"}, {value: result.value})
            } finally {}
        })


        // console.log(interaction)
		// Execute Associed SelectMenu(s)
        if(interaction.values.length > 1) { // ID Multiples donc Imprévisibles
            for(let i=0; interaction.values.length; i++) {
                // BETA
                console.log(i)
            }
        } else if(interaction.values[0].includes(":")) { // ID Imprévisible
            const ID = interaction.values[0].split(":")[0]
            const metadata = interaction.values[0].split(":")[1]
            // console.log(ID)
            // console.log(metadata)
            execution = bot.selectmenus.get(`${ID}:`)
            if(execution) execution.execute(interaction, bot, metadata, config)
        } else { // ID Prévisible
            execution = bot.selectmenus.get(interaction.values[0])
            if(execution) execution.execute(interaction, bot, config)
        }
	})
}

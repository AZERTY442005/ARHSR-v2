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

    bot.modals = new Discord.Collection()

	const elements = fs.readdirSync('./Interactions/Modals')
    for (const element of elements) {
        // console.log("element.includes('.'): "+element+": "+element.includes('.'))
        // TO UPGRADE
        if(!element.includes('.')) {
            const folder = fs.readdirSync(`./Interactions/Modals/${element}`)
            for (const file of folder) {
                const modals = require(`../Interactions/Modals/${element}/${file}`);
				bot.modals.set(modals.name, modals);
				// console.log(modals)
            }
        } else {
            const modals = require(`../Interactions/Modals/${element}`);
			bot.modals.set(modals.name, modals);
			// console.log(modals)
        }
    }
	// console.log(bot.modals)



    bot.on('modalSubmit', async (interaction) => {

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
            interaction.user.send(`${MessageLanguage("Blacklisted", bot, interaction.guild.id)}`)
            return
        }
		
		// DATAS Modals
        mongo().then(async (mongoose) => {
            try {
                let result = await StatisticsSchema.findOne({type: "interaction"})
                if(!result) {
                    await new StatisticsSchema({type: "interaction", value:0}).save()
                    result = await StatisticsSchema.findOne({type: "interaction"})
                }
                result.value++
                await StatisticsSchema.findOneAndUpdate({type: "interaction"}, {value: result.value})
            } finally {}
        })


		// Execute Associed MODAL
		// console.log(interaction.customId)
        // execution = bot.modals.get(interaction.customId)
        
		// console.log(execution)
        // execution.execute(interaction, bot, config)
        // Execute Associed Button(s)
        if(interaction.customId.includes(":")) {
            const ID = interaction.customId.split(":")[0]
            // const metadata = interaction.customId.split(":")[1]
            const metadata = interaction.customId.split(":").slice(1)
            execution = bot.modals.get(`${ID}:`)
            if(execution) execution.execute(interaction, bot, metadata, config)
        } else {
            execution = bot.modals.get(interaction.customId)
            if(execution) execution.execute(interaction, bot, config)
        }

	})
}

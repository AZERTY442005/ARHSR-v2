// ©2022 AZERTY. All rights Reserved | AZERTY#9999
const MessageLanguage = require("../Functions/MessageLanguage.js")
const Discord = require("discord.js")
const { MessageEmbed } = Discord
const fs = require('fs')
const yaml = require('js-yaml')
// const fetch = require('node-fetch')

let config = yaml.load(fs.readFileSync("./config.yaml", "utf8"))
const mongo = require('../Functions/Mongo.js')
const StatisticsSchema = require("../DataBase/schemas/statistics-schema")
const LanguagesSchema = require("../DataBase/schemas/languages-schema")
const UsersSchema = require("../DataBase/schemas/users-schema")
// const BotSchema = require("../DataBase/schemas/bot-schema.js")

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1)
}

module.exports = async (bot, config) => {

    bot.autocompletes = new Discord.Collection()

	const elements = fs.readdirSync('./Interactions/AutoCompletes')
    for (const element of elements) {
        // console.log("element.includes('.'): "+element+": "+element.includes('.'))
        // TO UPGRADE
        if(!element.includes('.')) {
            const folder = fs.readdirSync(`./Interactions/AutoCompletes/${element}`)
            for (const file of folder) {
                const autocomplete = require(`../Interactions/AutoCompletes/${element}/${file}`);
				bot.autocomplete.set(file.slice(0, -3), autocomplete);
				// console.log(autocomplete)
            }
        } else {
            const autocomplete = require(`../Interactions/AutoCompletes/${element}`);
			bot.autocompletes.set(element.slice(0, -3), autocomplete);
			// console.log(autocomplete)
        }
    }
	// console.log(bot.autocompletes)

    bot.on('interactionCreate', async (interaction) => {
		if (!interaction.isAutocomplete()) return

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
        let blacklist = JSON.parse(fs.readFileSync("./DataBase/blacklist.json", "utf8"))
        if(blacklist.includes(interaction.user.id)) {
            // message.delete()
            interaction.user.send(`${MessageLanguage("Blacklisted", bot, message.guild.id)}`)
            return
        }
		
		// DATAS AutoCompletes
        mongo().then(async (mongoose) => {
            try {
                let result = await StatisticsSchema.findOne({type: "autocomplete"})
                if(!result) {
                    await new StatisticsSchema({type: "autocomplete", value:0}).save()
                    result = await StatisticsSchema.findOne({type: "autocomplete"})
                }
                result.value++
                await StatisticsSchema.findOneAndUpdate({type: "autocomplete"}, {value: result.value})
            } finally {}
        })


        // const AutoCompleteExecution = bot.autocompletes.get(interaction.commandName)
        // if(AutoCompleteExecution) {
        //     const Result = await AutoCompleteExecution.execute(interaction, bot, config)
        //     console.log(Result)
        // }

        let choices
        if(interaction.commandName == "déréserver") {
            await mongo().then(async (mongoose) => {
                try {
                    let result = await UsersSchema.findOne({userID: interaction.user.id})
                    if(!result) {
                        await new UsersSchema({userID: interaction.user.id, class:"", login:"", password:"", ChatReplying: false, reservations: []}).save()
                        result = await UsersSchema.findOne({userID: interaction.user.id})
                    }
                    // console.log(result)
        
                    let Réservations = new Array()
                    result.reservations.forEach(reservation => {
                        Réservations.push(`${reservation.date} - ${capitalizeFirstLetter(reservation.restaurant)}`)
                    })
        
                    // console.log(Réservations)
                    choices = Réservations
                } finally {}
            })
        }

		// Get Associed AutoComplete
        // choices = bot.slashcommands.get(interaction.commandName).autocomplete
        // console.log(choices)

        const focusedValue = interaction.options.getFocused()
        // console.log(focusedValue)
		const filtered = choices.filter(choice => choice.startsWith(focusedValue))
        // console.log(filtered)
		await interaction.respond(
			filtered.map(choice => ({ name: choice, value: choice })),
		)

	})
}

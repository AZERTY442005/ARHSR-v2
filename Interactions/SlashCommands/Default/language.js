// ©2022 AZERTY. All rights Reserved | AZERTY#9999
const MessageLanguage = require("../../../Functions/MessageLanguage.js")
const { MessageEmbed } = require("discord.js")
const fs = require('fs')
// const fetch = require('node-fetch')
const yaml = require('js-yaml')
const CheckUserPermissions = require("../../../Functions/SlashCommands/CheckUserPermissions.js")
const { SlashCommandBuilder } = require("@discordjs/builders")

const mongo = require('../../../Functions/Mongo.js')
const LanguagesSchema = require("../../../DataBase/schemas/languages-schema")

module.exports = {
    name: 'language',
    description: {"fr": "Change la Langue du Bot", "en": "Change the Bot's Language"},
    permissions: [],
    category: "Default",
    global: true,
    enabled: true,
    MP: false,
    data: new SlashCommandBuilder()
        .setName("language")
        .setDescription("Change la Langue du Bot")
        .addStringOption((option) => option
            .setName("language")
            .setDescription("New Language")
            .setRequired(true)
            .addChoices(
                {name: "English", value:"en"},
                {name: "Français", value:"fr"},
            )
        ),
    async execute(interaction, bot, config) {
        // let language
        const NewLanguage = interaction.options.getString("language")
        await mongo().then(async (mongoose) => {
            try {
                let result = await LanguagesSchema.findOne({guildID: interaction.guild.id})
                if(!result) {
                    await new LanguagesSchema({guildID: interaction.guild.id, language:config.DefaultLanguage}).save()
                    result = await LanguagesSchema.findOne({guildID: interaction.guild.id})
                }
                // console.log(result.language)
                // result.value++
                await LanguagesSchema.findOneAndUpdate({guildID: interaction.guild.id}, {language: NewLanguage})
                // language = NewLanguage
            } finally {}
        })
        bot.languages.set(interaction.guild.id, NewLanguage)
        // let message_language = yaml.load(fs.readFileSync("./message-language.yaml", "utf8"))
        
        if (!CheckUserPermissions("ADMINISTRATOR", bot, interaction, __filename)) return
        
        const LanguagesList = {
            "fr": "Français",
            "en": "English",
            "us": "English"
        }

        let Embed = new MessageEmbed()
            .setTitle(`${MessageLanguage("NewLanguage", bot, interaction.guild.id)}`)
            .setDescription(`${LanguagesList[NewLanguage]}`)
            .setAuthor({name:`${interaction.user.tag}`, iconURL:interaction.user.displayAvatarURL({dynamic:true})})
            .setColor("BLUE")
            .setTimestamp().setFooter({text:`${("0" + new Date().getHours()).slice(-2)}:${("0" + new Date().getMinutes()).slice(-2)}:${("0" + new Date().getSeconds()).slice(-2)} ${("0" + new Date().getDate()).slice(-2)}/${("0" + (new Date().getMonth()+1)).slice(-2)}/${new Date().getFullYear()}`})
        interaction.reply({embeds:[Embed]})
    }
}
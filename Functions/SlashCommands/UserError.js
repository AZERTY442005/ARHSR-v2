// ©2022 AZERTY. All rights Reserved | AZERTY#9999
const MessageLanguage = require("../../Functions/MessageLanguage.js")
const { MessageEmbed } = require("discord.js")
const fs = require("fs")
// const fetch = require('node-fetch')
const yaml = require('js-yaml')
// const {format: prettyFormat} = require('pretty-format')
// const path = require('path')
const mongo = require('../../Functions/Mongo')
const LanguagesSchema = require("../../DataBase/schemas/languages-schema")

module.exports = async (error, bot, interaction, filepath, ephemeral) => {
    let language
    await mongo().then(async (mongoose) => {
        try {
            let result = await LanguagesSchema.findOne({guildID: interaction.guild.id})
            if(!result) {
                await new LanguagesSchema({guildID: interaction.guild.id, language:"en"}).save()
                result = await LanguagesSchema.findOne({guildID: interaction.guild.id})
            }
            language = result.language
        } finally {}
    })
    let message_language = yaml.load(fs.readFileSync("./message-language.yaml", "utf8"));


    const Index = error.split(" ").shift()
    const args = error.substr(error.indexOf(" ") + 1).split(" ")
    args.shift()
    for(let i=0;i<args.length;i++) {
        while(args[i].includes("_")) args[i] = args[i].replace("_", " ")
    }
    
    let sent
    if(!language) {
        sent = MessageLanguage("UserError", bot, interaction.guild.id)[Index]
    } else {
        sent = message_language[language]["UserError"][Index]
    }

    sent = sent
    .replace("{0}", `${!args[0]?"":args[0]}`)
    .replace("{1}", `${!args[1]?"":args[1]}`)
    .replace("{2}", `${!args[2]?"":args[2]}`)
    .replace("{3}", `${!args[3]?"":args[3]}`)
    .replace("{4}", `${!args[4]?"":args[4]}`)
    const Embed = new MessageEmbed()
    .setAuthor({name:`${interaction.user.tag}`, iconURL:interaction.user.displayAvatarURL({dynamic:true})})
    .setDescription(`:x: **${sent}**`)
    .setColor("RED")
    interaction.reply({embeds:[Embed], components:[], ephemeral:ephemeral!=undefined?ephemeral:true}).catch(()=>{})
}

// ©2022 AZERTY. All rights Reserved | AZERTY#9999
const MessageLanguage = require("../../Functions/MessageLanguage.js")
const { MessageEmbed } = require("discord.js")
const fs = require("fs")
// const fetch = require('node-fetch')
const yaml = require('js-yaml')
// const {format: prettyFormat} = require('pretty-format')
// const path = require('path')

// const mongo = require('../../Functions/Mongo.js')
// const LanguagesSchema = require("../../DataBase/schemas/languages-schema")

module.exports = async (msg, bot, interaction, filepath, ephemeral, edit, language) => {
    let message_language = yaml.load(fs.readFileSync("./message-language.yaml", "utf8"))

    const Index = msg.split(" ").shift()
    const args = msg.substr(msg.indexOf(" ") + 1).split(" ")
    for(let i=0;i<args.length;i++) {
        while(args[i].includes("_")) args[i] = args[i].replace("_", " ")
    }
    // console.log(Index)
    // console.log(args)
    let sent
    if(!language) {
        sent = MessageLanguage("Success", bot, interaction.guild.id)[Index]
        // console.log(MessageLanguage("Success", bot, interaction.guild.id))
        // console.log(MessageLanguage("Success", bot, interaction.guild.id)[Index])
    } else {
        sent = message_language[language]["Success"][Index]
    }
    // console.log(sent)
    sent = sent
    .replace("{0}", `${!args[0]?"":args[0]}`)
    .replace("{1}", `${!args[1]?"":args[1]}`)
    .replace("{2}", `${!args[2]?"":args[2]}`)
    .replace("{3}", `${!args[3]?"":args[3]}`)
    .replace("{4}", `${!args[4]?"":args[4]}`)
    const Embed = new MessageEmbed()
    .setAuthor({name:`${interaction.user.tag}`, iconURL:interaction.user.displayAvatarURL({dynamic:true})})
    // .setDescription(`:white_check_mark: ${msg}`)
    .setDescription(`:white_check_mark: ${sent}`)
    .setColor("GREEN")
    // interaction.reply({embeds:[Embed], components:[], ephemeral:ephemeral!=undefined?ephemeral:true}).catch(err => {})
    if(!edit) {
        interaction.reply({embeds:[Embed], components:[], ephemeral:ephemeral!=undefined?ephemeral:true}).catch(()=>{})
    } else {
        interaction.editReply({embeds:[Embed], components:[], ephemeral:ephemeral!=undefined?ephemeral:true}).catch(()=>{})
    }
}

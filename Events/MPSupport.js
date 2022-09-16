// ©2022 AZERTY. All rights Reserved | AZERTY#9999
const MessageLanguage = require("../Functions/MessageLanguage.js")
const fs = require("fs")
const yaml = require('js-yaml')
const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js")

const mongo = require('../Functions/Mongo.js')
const UsersSchema = require("../DataBase/schemas/users-schema")

module.exports = {
    name: "messageCreate",
    async execute(message, bot, config) {
        if(!message.channel.type == "DM" || message.guild || message.author.id == config.BotInfo.ID) return    
        // console.log(message)
        // console.log(bot)
    
        // return
        // IF BOT IS DISABLED
        if(bot.disabled) return

        const Embed = new MessageEmbed()
        .setTitle(`Une question ? Un commentaire ? Un retour ?`)
        .setDescription(`${message.content}`)
        .setAuthor({name:`${message.author.tag}`, iconURL:message.author.displayAvatarURL({dynamic:true})})
        .setColor("AQUA")
        .setTimestamp().setFooter({text:`${("0" + new Date().getHours()).slice(-2)}:${("0" + new Date().getMinutes()).slice(-2)}:${("0" + new Date().getSeconds()).slice(-2)} ${("0" + new Date().getDate()).slice(-2)}/${("0" + (new Date().getMonth()+1)).slice(-2)}/${new Date().getFullYear()}`})
        const row1 = new MessageActionRow()
        .addComponents(
            new MessageButton()
            // .setCustomId(`ConfirmChat:${message.content}`)
            .setCustomId(`ConfirmChat`)
            .setLabel(`Question`)
            .setEmoji(`❔`)
            .setStyle("PRIMARY"),
            new MessageButton()
            .setCustomId("Feedback")
            .setLabel(`Feedback`)
            .setEmoji(`📝`)
            .setStyle("SECONDARY"),
            new MessageButton()
            .setCustomId("Reportbug")
            .setLabel(`Rapporter un Bug`)
            .setEmoji(`💥`)
            .setStyle("SECONDARY"),
        )
        const row2 = new MessageActionRow()
        .addComponents(
            new MessageButton()
            .setCustomId("Close")
            .setLabel(`Annuler`)
            .setEmoji(`❌`)
            .setStyle("DANGER"),
            new MessageButton()
            .setURL("https://sites.google.com/view/arhsr/informations/documentation")
            .setLabel("Page d'Aide/Documentation")
            .setStyle("LINK"),
        )
        message.reply({embeds:[Embed], components:[row1, row2], allowedMentions:{repliedUser:false}})

    }
}

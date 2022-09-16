// ©2022 AZERTY. All rights Reserved | AZERTY#9999
const MessageLanguage = require("../../../Functions/MessageLanguage.js")
const { MessageEmbed, MessageActionRow, MessageButton, MessageSelectMenu } = require("discord.js")
const { SlashCommandBuilder } = require('@discordjs/builders')

const fs = require('fs')

// console.log(require("discord.js"))

module.exports = {
    name: 'help',
    description: {"fr": "Page d'aide", "en": "Help Page"},
    usage: "help",
    permissions: [],
    category: "Default",
    global: true,
    enabled: true,
    MP: false,
    data: new SlashCommandBuilder()
        .setName("help")
        .setDescription("Help Page"),
    async execute(interaction, bot, config) {

        // console.log(bot.slashcommands)
        // bot.slashcommands.sort((a, b) => a.name.localeCompare(b.name))
        // console.log(bot.slashcommands)

        let helpcommands = ""
        bot.slashcommands.forEach(slashcommand => {
            if(slashcommand.category=="Default") helpcommands = helpcommands + `\`${slashcommand.name}\` ${slashcommand.description[MessageLanguage("Language", bot, interaction.guild.id)]}\n`
        })
        helpcommands = helpcommands.slice(0, -1)
        
        let ArhsrCommands = ""
        bot.slashcommands.forEach(slashcommand => {
            if(slashcommand.category=="Arhsr") ArhsrCommands = ArhsrCommands + `\`${slashcommand.name}\` ${slashcommand.description[MessageLanguage("Language", bot, interaction.guild.id)]}\n`
        })
        ArhsrCommands = ArhsrCommands.slice(0, -1)

        // const Commands = bot.slashcommand.sort(function(a, b) { // Commands Sorter
        //     if(Categories.indexOf(a.category) < Categories.indexOf(b.category)) return -1
        //     if(Categories.indexOf(a.category) > Categories.indexOf(b.category)) return 1
        //     return 0
        // })

        // Embed
        const Embed = new MessageEmbed()
        .setTitle("Page d'Aide")
        .setColor("GOLD")
        .setDescription(`${helpcommands}`)
        .addField(`Réservation Automatique`, `${ArhsrCommands}`)
        .setImage("https://media.discordapp.net/attachments/960440723369517106/996423763522506782/rainbow-border.gif")
        .setAuthor({name:`${interaction.user.tag}`, iconURL:interaction.user.displayAvatarURL({dynamic:true})})
        .setTimestamp().setFooter({text:`${("0" + new Date().getHours()).slice(-2)}:${("0" + new Date().getMinutes()).slice(-2)}:${("0" + new Date().getSeconds()).slice(-2)} ${("0" + new Date().getDate()).slice(-2)}/${("0" + (new Date().getMonth()+1)).slice(-2)}/${new Date().getFullYear()}`})

        const row = new MessageActionRow()
        .addComponents(
            new MessageButton()
            .setURL("https://sites.google.com/view/arhsr/informations/documentation")
            .setLabel("Page d'Aide/Documentation")
            .setStyle("LINK"),
        )

        interaction.reply({embeds:[Embed], components:[row], ephemeral:true})
    }
}
// ©2022 AZERTY. All rights Reserved | AZERTY#9999
const MessageLanguage = require("../../../Functions/MessageLanguage.js")
const { MessageEmbed } = require("discord.js")
// const fs = require("fs")
// const yaml = require('js-yaml')
// const fetch = require("node-fetch")
const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = {
    name: 'credits',
    description: {"fr": "Affiche mes credits", "en": "Show my credits"},
    permissions: [],
    category: "Default",
    global: true,
    enabled: true,
    MP: true,
    data: new SlashCommandBuilder()
        .setName("credits")
        .setDescription("Affiche mes credits"),
    async execute(interaction, bot, config) {
        let EmbedCredits = new MessageEmbed()
        .setTitle("CREDITS")
        .setThumbnail(config.BotInfo.IconURL)
        // .setColor("RANDOM")
        .setColor("GOLD")
        .addFields(
            {name:`${MessageLanguage("Name", bot, interaction.guild.id)}`,value:`${config.BotInfo.name}`,inline:true},
            {name:`${MessageLanguage("Version", bot, interaction.guild.id)}`,value:`${config.BotInfo.version}`,inline:true},
            {name:`${MessageLanguage("UpdatedAt", bot, interaction.guild.id)}`,value:`${config.BotInfo.UpdatedAt}`,inline:true},
            {name:`${MessageLanguage("CreatedAt", bot, interaction.guild.id)}`,value:`${config.BotInfo.CreatedAt}`,inline:true},
            // {name:`Creator`,value:"<@452454205056352266>",inline:true},
            {name:`${MessageLanguage("Creator", bot, interaction.guild.id)}`,value:`<@${config.CreatorID}>\n${config.CreatorName}`,inline:true},
            {name:`${MessageLanguage("Owner", bot, interaction.guild.id)}`,value:`<@${config.OwnerID}>\n${config.OwnerName}`,inline:true},
        )
        .setFooter({text:`${config.BotInfo.name}`, iconURL:`${config.BotInfo.IconURL}`})
        .setTimestamp().setFooter({text:`${("0" + new Date().getHours()).slice(-2)}:${("0" + new Date().getMinutes()).slice(-2)}:${("0" + new Date().getSeconds()).slice(-2)} ${("0" + new Date().getDate()).slice(-2)}/${("0" + (new Date().getMonth()+1)).slice(-2)}/${new Date().getFullYear()}`})
        
        interaction.reply({embeds:[EmbedCredits], ephemeral:true})
    }
}
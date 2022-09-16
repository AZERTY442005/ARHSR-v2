// ©2022 AZERTY. All rights Reserved | AZERTY#9999
const MessageLanguage = require("../../../Functions/MessageLanguage.js")
const { MessageEmbed } = require("discord.js")
const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = {
    name: 'ping',
    description: {"fr": "Calcule le ping du Bot", "en": "Calculates the Bot's ping"},
    permissions: [],
    category: "Default",
    global: true,
    enabled: true,
    MP: true,
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Calcule le ping du Bot"),
    async execute(interaction, bot, config) {
        const Embed = new MessageEmbed()
        .setTitle(`Ping`)
        .addField(`${MessageLanguage("BotLatency", bot, interaction.guild.id)}`, `${Date.now() - interaction.createdTimestamp} ms`)
        .addField(`${MessageLanguage("APILatency", bot, interaction.guild.id)}`, `${bot.ws.ping} ms`)
        .setAuthor({name:`${interaction.user.tag}`, iconURL:interaction.user.displayAvatarURL({dynamic:true})})
        .setColor("GREEN")
        .setTimestamp().setFooter({text:`${("0" + new Date().getHours()).slice(-2)}:${("0" + new Date().getMinutes()).slice(-2)}:${("0" + new Date().getSeconds()).slice(-2)} ${("0" + new Date().getDate()).slice(-2)}/${("0" + (new Date().getMonth()+1)).slice(-2)}/${new Date().getFullYear()}`})
        interaction.reply({embeds:[Embed], ephemeral:true})
    }
}
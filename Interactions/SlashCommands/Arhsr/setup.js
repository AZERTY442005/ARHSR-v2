// ©2022 AZERTY. All rights Reserved | AZERTY#9999
// const MessageLanguage = require("../../Functions/MessageLanguage.js")
// const ErrorPreventer = require("../../Functions/ErrorPreventer.js")
const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js")
// const fs = require("fs")
// const yaml = require("js-yaml")
// const fetch = require("node-fetch")
const { SlashCommandBuilder } = require("@discordjs/builders")

const mongo = require('../../../Functions/Mongo.js')
const UsersSchema = require("../../../DataBase/schemas/users-schema")

module.exports = {
    name: "setup",
    description: { fr: "Mise en Place Rapide", en: "Fast Setting Up" },
    permissions: [],
    category: "Arhsr",
    global: false,
    enabled: true,
    MP: false,
    data: new SlashCommandBuilder()
        .setName("setup")
        .setDescription("Mise en Place Rapide"),
    async execute(interaction, bot, config) {
        const Embed = new MessageEmbed()
        .setTitle(`Mise en Place Rapide`)
        .addField(`Description`, `Ce bot __non affilié__ au Lycée Charles Péguy vous permettra de réserver votre restaurant souhaité pour le lendemain **Automatiquement**.
        Fonctionnant avec l'API *Discord.js v13* et une Base de Données *MongoDB* Sécurisée, il sera en ligne 24/7.`)
        .addField(`Usage`, `Pour accéder à ma Page d'Aide, vous pouvez taper \`/help\`\nPour entrer ses informations de connexion, tapez \`/login\`\nPour réserver prochainement à un Restaurant Automatiquement, tapez \`/réserver\``)
        .addField(`Contacts`, `Pour toutes questions ou problèmes vous pouvez directement m'envoyer un message à moi ou à **AZERTY#9999** et je vous répondrai sous peu.`)
        .setAuthor({name:`${interaction.user.tag}`, iconURL:interaction.user.displayAvatarURL({dynamic:true})})
        .setColor("GREEN")
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

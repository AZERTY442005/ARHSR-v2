// ©2022 AZERTY. All rights Reserved | AZERTY#9999
// const MessageLanguage = require("../../../Functions/MessageLanguage.js")
// const ErrorPreventer = require("../../../Functions/ErrorPreventer.js");
// const { MessageEmbed, Interaction } = require("discord.js");
// const fs = require("fs")
// const fetch = require('node-fetch')
// const Success = require("../../../Functions/SlashCommands/Success.js")
// const yaml = require('js-yaml')
const { SlashCommandBuilder } = require("@discordjs/builders");

const { Modal, TextInputComponent, showModal } = require("discord-modals")

module.exports = {
    name: 'reportbug',
    description: {"fr": "Rapporte un Bug", "en": "Report a Bug"},
    permissions: [],
    category: "Default",
    global: true,
    enabled: true,
    MP: true,
    data: new SlashCommandBuilder()
        .setName("reportbug")
        .setDescription("Rapporte un Bug"),
    async execute(interaction, bot, config) {
        const modal = new Modal()
        .setCustomId("reportbug")
        .setTitle("Rapport de Bug")
        .addComponents(
            new TextInputComponent()
            .setCustomId("reportbug")
            .setLabel("Description du Bug")
            .setStyle("LONG")
            .setPlaceholder("Décrivez le bug et/ou l'erreur")
            .setRequired(true)
        )
        showModal(modal, {
            client: bot,
            interaction: interaction,
        })
    }
}
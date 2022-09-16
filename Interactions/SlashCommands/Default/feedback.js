// ©2022 AZERTY. All rights Reserved | AZERTY#9999
const MessageLanguage = require("../../../Functions/MessageLanguage.js")
// const ErrorPreventer = require("../../../Functions/ErrorPreventer.js");
const { MessageEmbed, Interaction } = require("discord.js");
const fs = require("fs")
const fetch = require('node-fetch')
const Success = require("../../../Functions/SlashCommands/Success.js")
const yaml = require('js-yaml')
const { SlashCommandBuilder } = require("@discordjs/builders");

const FeedbackCooldown = new Set()

const { Modal, TextInputComponent, showModal } = require("discord-modals")

module.exports = {
    name: 'feedback',
    description: {"fr": "Envoie un retour d'utilisation au développeur", "en": "Send a return of use to the developer"},
    permissions: [],
    category: "Default",
    global: true,
    enabled: true,
    MP: true,
    data: new SlashCommandBuilder()
        .setName("feedback")
        .setDescription("Envoie un retour d'utilisation au développeur"),
    async execute(interaction, bot, config) {
        const modal = new Modal()
            .setCustomId("feedback")
            .setTitle("Feedback")
            .addComponents(
                new TextInputComponent()
                    .setCustomId("feedback")
                    .setLabel("Feedback")
                    .setStyle("LONG")
                    .setPlaceholder("Écrivez votre retour ici")
                    .setRequired(true)
            )
        showModal(modal, {
            client: bot,
            interaction: interaction,
        })
    }
}
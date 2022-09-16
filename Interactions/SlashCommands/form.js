// ©2022 AZERTY. All rights Reserved | AZERTY#9999
// const MessageLanguage = require("../../Functions/MessageLanguage.js")
// const ErrorPreventer = require("../../Functions/ErrorPreventer.js")
// const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js")
// const fs = require("fs")
// const yaml = require("js-yaml")
// const fetch = require("node-fetch");
const { SlashCommandBuilder } = require("@discordjs/builders")

// console.log(require("discord-modals"))
const { Modal, TextInputComponent, SelectMenuComponent, showModal } = require("discord-modals")

module.exports = {
    name: "form",
    description: { fr: "Crée un Formulaire", en: "Create a Form" },
    permissions: [],
    global: false,
    enabled: true,
    MP: false,
    data: new SlashCommandBuilder()
        .setName("form")
        .setDescription("Create a Form"),
    async execute(interaction, bot, config) {
         // Import all

        const modal = new Modal() // We create a Modal
        .setCustomId("test")
        .setTitle("Test")
        .addComponents(
            new TextInputComponent() // We create a Text Input Component
                .setCustomId("name")
                .setLabel("Name")
                .setStyle("SHORT") //IMPORTANT: Text Input Component Style can be 'SHORT' or 'LONG'
                .setPlaceholder("Write your name here")
                .setRequired(true), // If it's required or not

            new SelectMenuComponent() // We create a Select Menu Component
                .setCustomId("theme")
                .setPlaceholder("What theme of Discord do you like?")
                .addOptions(
                    {
                        label: "Dark",
                        description: "The default theme of Discord.",
                        value: "dark",
                        emoji: "⚫",
                    },
                    {
                        label: "Light",
                        description:
                            "Some people hate it, some people like it.",
                        value: "light",
                        emoji: "⚪",
                    }
                )
        )

        showModal(modal, {
            client: bot, // Client to show the Modal through the Discord API.
            interaction: interaction, // Show the modal with interaction data.
        })
    },
}

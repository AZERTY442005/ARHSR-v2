// ©2022 AZERTY. All rights Reserved | AZERTY#9999
// const MessageLanguage = require("../../Functions/MessageLanguage.js")
// const ErrorPreventer = require("../../Functions/ErrorPreventer.js")
const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js")
// const fs = require("fs")
// const yaml = require("js-yaml")
// const fetch = require("node-fetch")
const { SlashCommandBuilder } = require("@discordjs/builders")

module.exports = {
    name: "srhsr",
    description: { fr: "Auto-Réservation des Restaurants du Lycée", en: "Self-Booking of High School Restaurants" },
    permissions: [],
    category: "Default",
    global: false,
    enabled: false,
    MP: true,
    data: new SlashCommandBuilder()
        .setName("srhsr")
        // .setDescription("Self-Booking of High School Restaurants")
        .setDescription("Auto-Réservation des Restaurants du Lycée")
        .addSubcommand((subcommand) =>
            subcommand
            .setName("help")
            .setDescription("Page d'Aide")
        )
        .addSubcommand((subcommand) =>
            subcommand
            .setName("login")
            .setDescription("Identifiants de Connexion")
        )
        .addSubcommand((subcommand) =>
            subcommand
            .setName("order")
            // .setDescription("Book for a restaurant")
            .setDescription("Réserve un Restaurant")
            .addNumberOption((option) => option
                .setName("date")
                // .setDescription("Date of the Month")
                .setDescription("Jour du Mois")
                .setRequired(true)
            )
            .addStringOption((option) => option
                .setName("restaurant")
                // .setDescription("Choosen Restaurant")
                .setDescription("Restaurant choisi")
                .setRequired(true)
                .addChoices(
                    {name: "Italien", value:"italien"},
                    {name: "Breton", value:"breton"},
                    {name: "Caféteria", value:"caféteria"},
                    {name: "Végétarien", value:"végétarien"},
                    {name: "Sandwicherie", value:"sandwicherie"},
                )
            )
        ),
    async execute(interaction, bot, config) {
        
    }
}

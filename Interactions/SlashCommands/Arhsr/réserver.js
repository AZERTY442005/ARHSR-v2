// ©2022 AZERTY. All rights Reserved | AZERTY#9999
// const MessageLanguage = require("../../Functions/MessageLanguage.js")
// const ErrorPreventer = require("../../Functions/ErrorPreventer.js")
const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js")
// const fs = require("fs")
// const yaml = require("js-yaml")
// const fetch = require("node-fetch")
const { SlashCommandBuilder } = require("@discordjs/builders")

const Error = require("../../../Functions/SlashCommands/Error.js")

const mongo = require('../../../Functions/Mongo.js')
const UsersSchema = require("../../../DataBase/schemas/users-schema")

module.exports = {
    name: "réserver",
    description: { fr: "Réserve pour un Restaurant", en: "Book for a Restautant" },
    permissions: [],
    category: "Arhsr",
    global: false,
    enabled: true,
    MP: false,
    data: new SlashCommandBuilder()
        .setName("réserver")
        .setDescription("Réserve pour un Restaurant")
        .addNumberOption((option) => option
            .setName("jour")
            .setDescription("Jour du Mois")
            .setRequired(true)
        )
        .addStringOption((option) => option
            .setName("restaurant")
            .setDescription("Restaurant choisi")
            .setRequired(true)
            .addChoices(
                {name: "Italien", value:"italien"},
                {name: "Breton", value:"breton"},
                {name: "Caféteria", value:"caféteria"},
                {name: "Végétarien", value:"végétarien"},
                {name: "Sandwicherie", value:"sandwicherie"},
            )
        ),
    async execute(interaction, bot, config) {
        const Day = interaction.options.getNumber("jour")
        const Restaurant = interaction.options.getString("restaurant")

        if(Day<1 || Day>31) return Error("SpecifyValidDate", bot, interaction, __filename)

        const Today = new Object()
        Today.Day = new Date().getDate()
        Today.Month = new Date().getMonth()+1
        // Today.Month = 12
        Today.Year = new Date().getFullYear()
        console.log(Today)

        await mongo().then(async (mongoose) => {
            try {
                let result = await UsersSchema.findOne({userID: interaction.user.id})
                if(!result) {
                    await new UsersSchema({userID: interaction.user.id, class:"", login:"", password:"", ChatReplying: false, reservations: []}).save()
                    result = await UsersSchema.findOne({userID: interaction.user.id})
                }

                if(!result.class || !result.login || !result.password) return Error("/login", bot, interaction, __filename)

                let Reservations = result.reservations
                // console.log(Reservations)

                let ReservationFormat

                if(Today.Day < Day) { // Réserver pour ce mois
                    console.log("// Réserver pour ce mois")
                    ReservationFormat = `${("0" + Day).slice(-2)}/${("0" + Today.Month).slice(-2)}/${Today.Year}`

                } else if(Today.Month+1 > 12) { // Mois > à 12: Réserver pour l'année suivante
                    console.log("// Mois > à 12: Réserver pour l'année suivante")
                    ReservationFormat = `${("0" + Day).slice(-2)}/01/${Today.Year+1}`

                } else { // Jour déjà passé: Réserver pour le mois prochain
                    console.log("// Jour déjà passé: Réserver pour le mois prochain")
                    ReservationFormat = `${("0" + Day).slice(-2)}/${("0" + Today.Month+1).slice(-2)}/${Today.Year}`
                }

                console.log(ReservationFormat)

                const AlreadyReservation = result.reservations.find(reservation => reservation.date == ReservationFormat)

                if(AlreadyReservation) return Error("AlreadyReserved", bot, interaction, __filename)

                Reservations.push({restaurant: Restaurant, date: ReservationFormat})

                await UsersSchema.findOneAndUpdate({userID: interaction.user.id}, {reservations: Reservations}).then(() => {
                    const Embed = new MessageEmbed()
                    .setDescription(`:white_check_mark: Réservation enregistrée pour le **${ReservationFormat}**`)
                    .setAuthor({name:`${interaction.user.tag}`, iconURL:interaction.user.displayAvatarURL({dynamic:true})})
                    .setColor("GREEN")
                    .setTimestamp().setFooter({text:`${("0" + new Date().getHours()).slice(-2)}:${("0" + new Date().getMinutes()).slice(-2)}:${("0" + new Date().getSeconds()).slice(-2)} ${("0" + new Date().getDate()).slice(-2)}/${("0" + (new Date().getMonth()+1)).slice(-2)}/${new Date().getFullYear()}`})
                    interaction.reply({embeds:[Embed], ephemeral:true})
                }).catch((err) => {
                    Error("Error", bot, interaction, __filename)
                    console.error(err)
                })
            } finally {}
        })

    }
}

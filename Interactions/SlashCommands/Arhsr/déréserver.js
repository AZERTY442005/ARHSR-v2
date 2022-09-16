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

// function capitalizeFirstLetter(string) {
//     return string.charAt(0).toUpperCase() + string.slice(1)
// }
function RemoveFromArray(array, element) {
    for(var i=0; i<array.length; i++){
        if(array[i].date==element) {
            array.splice(i, 1)
        }
    }
}

module.exports = {
    name: "déréserver",
    description: { fr: "Supprime une réservation programmée", en: "Deletes a scheduled reservations" },
    permissions: [],
    category: "Arhsr",
    global: false,
    enabled: true,
    MP: false,
    data: new SlashCommandBuilder()
        .setName("déréserver")
        .setDescription("Supprime une réservation programmée")
        .addStringOption((option) => option
            .setName("réservation")
            .setDescription("Réservation programmée existante")
            .setRequired(true)
            .setAutocomplete(true)
        ),
    async execute(interaction, bot, config) {
        await mongo().then(async (mongoose) => {
            const Réservation = interaction.options.getString("réservation")
            const Réservation_Date = Réservation.split(" - ")[0]
            const Réservation_Restaurant = Réservation.split(" - ")[1]
            // console.log(Réservation_Date)
            // console.log(Réservation_Restaurant)

            try {
                let result = await UsersSchema.findOne({userID: interaction.user.id})
                if(!result) {
                    await new UsersSchema({userID: interaction.user.id, class:"", login:"", password:"", ChatReplying: false, reservations: []}).save()
                    result = await UsersSchema.findOne({userID: interaction.user.id})
                }
                const Réservations = result.reservations

                if(!Réservations.find(réservation => réservation.date == Réservation_Date)) return Error("InvalidReservation", bot, interaction, __filename)
                
                // console.log(Réservations)
                RemoveFromArray(Réservations, Réservation_Date)
                // console.log(Réservations)

                await UsersSchema.findOneAndUpdate({userID: interaction.user.id}, {reservations: Réservations}).then(() => {
                    const Embed = new MessageEmbed()
                    .setDescription(`:white_check_mark: La Réservation du **${Réservation_Date}** a été supprimée`)
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

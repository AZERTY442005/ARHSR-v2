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

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1)
}

module.exports = {
    name: "réservations",
    description: { fr: "Liste les réservations programmées", en: "List scheduled reservations" },
    permissions: [],
    category: "Arhsr",
    global: false,
    enabled: true,
    MP: false,
    data: new SlashCommandBuilder()
        .setName("réservations")
        .setDescription("Liste les réservations programmées"),
    async execute(interaction, bot, config) {
        

        await mongo().then(async (mongoose) => {
            try {
                let result = await UsersSchema.findOne({userID: interaction.user.id})
                if(!result) {
                    await new UsersSchema({userID: interaction.user.id, class:"", login:"", password:"", ChatReplying: false, reservations: []}).save()
                    result = await UsersSchema.findOne({userID: interaction.user.id})
                }

                let Réservations = new Array()
                result.reservations.forEach(reservation => {
                    Réservations.push(`- **${reservation.date}**: __${capitalizeFirstLetter(reservation.restaurant)}__`)
                })
                const Embed = new MessageEmbed()
                .setTitle(`Réservations Programmées`)
                .setDescription(`${result.reservations.length!=0?Réservations.join("\n"):`*Aucune réservation*`}`)
                .setAuthor({name:`${interaction.user.tag}`, iconURL:interaction.user.displayAvatarURL({dynamic:true})})
                .setColor("GREEN")
                .setTimestamp().setFooter({text:`${("0" + new Date().getHours()).slice(-2)}:${("0" + new Date().getMinutes()).slice(-2)}:${("0" + new Date().getSeconds()).slice(-2)} ${("0" + new Date().getDate()).slice(-2)}/${("0" + (new Date().getMonth()+1)).slice(-2)}/${new Date().getFullYear()}`})
                interaction.reply({embeds:[Embed], ephemeral:true})
                
            } finally {}
        })

    }
}

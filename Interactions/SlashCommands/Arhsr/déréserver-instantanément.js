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

const Dereserve = require("../../../Functions/Déréserve")

module.exports = {
    name: "déréserver-instantanément",
    description: { fr: "Déréserve la réservation active", en: "Unbook active booking" },
    permissions: [],
    category: "Arhsr",
    global: false,
    enabled: true,
    MP: false,
    data: new SlashCommandBuilder()
        .setName("déréserver-instantanément")
        .setDescription("Déréserve la réservation active"),
    async execute(interaction, bot, config) {
        interaction.deferReply({ephemeral:true})

        let login
        let password
        await mongo().then(async (mongoose) => {
            try {
                let result = await UsersSchema.findOne({userID: interaction.user.id})
                if(!result) {
                    await new UsersSchema({userID: interaction.user.id, class:"", login:"", password:"", ChatReplying: false, reservations: []}).save()
                    result = await UsersSchema.findOne({userID: interaction.user.id})
                }
                login = result.login
                password = result.password
                // await UsersSchema.findOneAndUpdate({userID: interaction.user.id}, {reservations: Reservations}).then(() => {
                //     const Embed = new MessageEmbed()
                //     .setDescription(`:white_check_mark: Réservation enregistrée pour le **${ReservationFormat}**`)
                //     .setAuthor({name:`${interaction.user.tag}`, iconURL:interaction.user.displayAvatarURL({dynamic:true})})
                //     .setColor("GREEN")
                //     .setTimestamp().setFooter({text:`${("0" + new Date().getHours()).slice(-2)}:${("0" + new Date().getMinutes()).slice(-2)}:${("0" + new Date().getSeconds()).slice(-2)} ${("0" + new Date().getDate()).slice(-2)}/${("0" + (new Date().getMonth()+1)).slice(-2)}/${new Date().getFullYear()}`})
                //     interaction.reply({embeds:[Embed], ephemeral:true})
                // }).catch((err) => {
                //     Error("Error", bot, interaction, __filename)
                //     console.error(err)
                // })
            } finally {}
        })

        // console.log(login)
        // console.log(password)

        const Output = await Dereserve(login, password)
        console.log(Output)
        interaction.editReply({content:`Status: ${Output.status}\nOutput: ${Output.output}\nDelay: ${Output.delay}`})

    }
}

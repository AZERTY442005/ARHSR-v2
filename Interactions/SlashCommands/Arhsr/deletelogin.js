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
    name: "deletelogin",
    description: { fr: "Supprime vos Identifiants de la Base de Données", en: "Deletes your Identifiers of the DataBase" },
    permissions: [],
    category: "Arhsr",
    global: false,
    enabled: true,
    MP: false,
    data: new SlashCommandBuilder()
        .setName("deletelogin")
        .setDescription("Supprime vos Identifiants de la Base de Données"),
    async execute(interaction, bot, config) {
        await mongo().then(async (mongoose) => {
            try {
                let result = await UsersSchema.findOne({userID: interaction.user.id})
                if(!result) {
                    await new UsersSchema({userID: interaction.user.id, class:"", login:"", password:"", ChatReplying: false, reservations: []}).save()
                    result = await UsersSchema.findOne({userID: interaction.user.id})
                }
                await UsersSchema.findOneAndUpdate({userID: interaction.user.id}, {class: "", login: "", password: ""}).then(() => {
                    const Embed = new MessageEmbed()
                    .setDescription(":white_check_mark: Informations supprimées")
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

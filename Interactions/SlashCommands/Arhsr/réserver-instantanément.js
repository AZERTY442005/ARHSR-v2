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

const Reserve = require("../../../Functions/Réserve")

module.exports = {
    name: "réserver-instantanément",
    description: { fr: "Réserve directement un restaurant", en: "Reserve instantly for a restaurant" },
    permissions: [],
    category: "Arhsr",
    global: false,
    enabled: true,
    MP: false,
    data: new SlashCommandBuilder()
        .setName("réserver-instantanément")
        .setDescription("Réserve directement un restaurant")
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
            )),
    async execute(interaction, bot, config) {
        interaction.deferReply({ephemeral:true})
        const Restaurant = interaction.options.getString("restaurant")

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
            } finally {}
        })

        // console.log(login)
        // console.log(password)

        const Output = await Reserve(login, password, Restaurant)
        console.log(Output)
        interaction.editReply({content:`Status: ${Output.status}\nOutput: ${Output.output}\nDelay: ${Output.delay}`})
    }
}

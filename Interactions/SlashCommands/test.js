// ©2022 AZERTY. All rights Reserved | AZERTY#9999
// const MessageLanguage = require("../../Functions/MessageLanguage.js")
// const ErrorPreventer = require("../../Functions/ErrorPreventer.js")
const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js")
// const fs = require("fs")
// const yaml = require("js-yaml")
// const fetch = require("node-fetch")
const { SlashCommandBuilder } = require("@discordjs/builders")

const mongo = require('../../Functions/Mongo.js')
const UsersSchema = require("../../DataBase/schemas/users-schema")

module.exports = {
    name: "test",
    description: { fr: "Test", en: "Test" },
    permissions: [],
    category: "Arhsr",
    global: false,
    enabled: true,
    MP: false,
    data: new SlashCommandBuilder()
        .setName("test")
        .setDescription("Test"),
    async execute(interaction, bot, config) {
        await mongo().then(async (mongoose) => {
            try {
                let result = await UsersSchema.findOne({userID: interaction.user.id})
                if(!result) {
                    await new UsersSchema({userID: interaction.user.id, class:"", login:"", password:"", ChatReplying: false, reservations: []}).save()
                    result = await UsersSchema.findOne({userID: interaction.user.id})
                }
                // console.log(UsersSchema)
                const Documents = await UsersSchema.find({})
                console.log(Documents)
                const Sorted = new Array()
                // console.log(Documents.find(element => element.class == "Term"))
                Documents.forEach(Document => {
                    if(Document.class == "BTS") Sorted.push(Document)
                })
                console.log(Sorted)
            } finally {}
        })
    }
}

// ©2022 AZERTY. All rights Reserved | AZERTY#9999
// const MessageLanguage = require("../../Functions/MessageLanguage.js")
const Error = require("../../../Functions/SlashCommands/Error.js")
const { Modal, TextInputComponent, showModal } = require("discord-modals")

const mongo = require('../../../Functions/Mongo.js')
const UsersSchema = require("../../../DataBase/schemas/users-schema")

module.exports = {
    name: "ReplyChat:",
    async execute(interaction, bot, metadata, config) {
        const User = bot.users.cache.find(user => user.id == interaction.message.embeds[0].description.split(" ")[0].slice(2, -1))
        // console.log(User)

        // console.log(metadata[0])

        let ChatReplying
        await mongo().then(async (mongoose) => {
            try {
                let result = await UsersSchema.findOne({userID: User.id})
                if(!result) {
                    await new UsersSchema({userID: User.id, class:"", login:"", password:"", ChatReplying: false, reservations: []}).save()
                    result = await UsersSchema.findOne({userID: User.id})
                }
                ChatReplying = result.ChatReplying
            } finally {}
        })

        // console.log(ChatReplying)
        if(ChatReplying) {
            const modal = new Modal() // We create a Modal
            .setCustomId(`ReplyChat:${metadata[0]}`)
            .setTitle("Reply")
            .addComponents(
                new TextInputComponent()
                .setCustomId("reply")
                .setLabel("Reply Message")
                .setStyle("LONG")
                .setPlaceholder("Write your reply here")
                .setRequired(true),
            )
    
            showModal(modal, {
                client: bot,
                interaction: interaction,
            })
        } else {
            Error("UserNotWaitingReply", bot, interaction, __filename)
            const row = interaction.message.components[0]
            row.components[0]
            .setDisabled(true)
            interaction.message.edit({components:[row]})
        }
    },
};

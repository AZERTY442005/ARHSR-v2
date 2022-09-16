// ©2022 AZERTY. All rights Reserved | AZERTY#9999
// const MessageLanguage = require("../../Functions/MessageLanguage.js")
const Error = require("../../../Functions/SlashCommands/Error.js")
const { MessageEmbed } = require("discord.js")
const { Modal, TextInputComponent, showModal } = require("discord-modals")

const mongo = require('../../../Functions/Mongo.js')
const UsersSchema = require("../../../DataBase/schemas/users-schema")

module.exports = {
    name: "CancelChat:",
    async execute(interaction, bot, metadata, config) {
        // const User = bot.users.cache.find(user => user.id == interaction.message.embeds[0].description.split(" ")[0].slice(2, -1))
        // console.log(User)

        interaction.deferUpdate()

        console.log(metadata[0])

        let ChatReplying
        await mongo().then(async (mongoose) => {
            try {
                let result = await UsersSchema.findOne({userID: interaction.user.id})
                if(!result) {
                    await new UsersSchema({userID: interaction.user.id, class:"", login:"", password:"", ChatReplying: false, reservations: []}).save()
                    result = await UsersSchema.findOne({userID: interaction.user.id})
                }
                ChatReplying = result.ChatReplying
                if(result.ChatReplying) await UsersSchema.findOneAndUpdate({userID: interaction.user.id}, {ChatReplying: false})
            } finally {}
        })

        if(ChatReplying) {
            const row = interaction.message.components[0]
            row.components[0]
            .setLabel(`Annulé`)
            .setDisabled(true)
            interaction.message.edit({components:[row]})

            const Channel = bot.channels.cache.find(channel => channel.id == config.ChatBotChannelID)
            // console.log(await Channel.messages.fetch())
            const Message = await Channel.messages.fetch(metadata[0])
            // console.log(Message)
            const row2 = Message.components[0]
            row2.components[0]
            .setLabel(`Annulé`)
            .setEmoji("❌")
            .setStyle("SECONDARY")
            .setDisabled(true)
            Message.edit({components:[row2]})
    
            const Embed = new MessageEmbed()
            .setDescription(":white_check_mark: Opération annulée")
            .setAuthor({name:`${interaction.user.tag}`, iconURL:interaction.user.displayAvatarURL({dynamic:true})})
            .setColor("AQUA")
            .setTimestamp().setFooter({text:`${("0" + new Date().getHours()).slice(-2)}:${("0" + new Date().getMinutes()).slice(-2)}:${("0" + new Date().getSeconds()).slice(-2)} ${("0" + new Date().getDate()).slice(-2)}/${("0" + (new Date().getMonth()+1)).slice(-2)}/${new Date().getFullYear()}`})
            // interaction.reply({embeds:[Embed]})
            interaction.message.edit({embeds:[Embed], components:[]})
    
            // const Embed2 = new MessageEmbed()
            // .setDescription(":x: Opération annulée")
            // .setAuthor({name:`${interaction.user.tag}`, iconURL:interaction.user.displayAvatarURL({dynamic:true})})
            // .setColor("ORANGE")
            // .setTimestamp().setFooter({text:`${("0" + new Date().getHours()).slice(-2)}:${("0" + new Date().getMinutes()).slice(-2)}:${("0" + new Date().getSeconds()).slice(-2)} ${("0" + new Date().getDate()).slice(-2)}/${("0" + (new Date().getMonth()+1)).slice(-2)}/${new Date().getFullYear()}`})
            // Channel.send({embeds:[Embed2]})
        } else {
            Error("NoOperationInProgress", bot, interaction, __filename, true, false, "fr")
            const row = interaction.message.components[0]
            row.components[0]
            .setDisabled(true)
            interaction.message.edit({components:[row]})
        }
        
    },
};

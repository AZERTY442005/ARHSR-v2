// ©2022 AZERTY. All rights Reserved | AZERTY#9999
// const MessageLanguage = require("../../Functions/MessageLanguage.js")
// const fs = require("fs")
// const yaml = require("js-yaml")
// const fetch = require("node-fetch")
const { MessageEmbed } = require("discord.js")
// const Success = require("../../Functions/SlashCommands/Success.js")

const mongo = require('../../Functions/Mongo.js')
const UsersSchema = require("../../DataBase/schemas/users-schema")

module.exports = {
    name: "ReplyChat:",
    async execute(interaction, bot, metadata, config) {
        // console.log(interaction)
        
        const Reply = interaction.getTextInputValue("reply")

        // console.log(metadata[0])

        // console.log(interaction.message.embeds[0].description)
        // console.log(interaction.message.embeds[0].description.split(" ")[0])
        // console.log(interaction.message.embeds[0].description.split(" ")[0].slice(2, -1))
        const User = bot.users.cache.find(user => user.id == interaction.message.embeds[0].description.split(" ")[0].slice(2, -1))
        // console.log(User)
        
        // console.log(Reply)
        const Embed = new MessageEmbed()
        // .setDescription(`${Reply}`)
        .addField(`Réponse`, `${Reply}`)
        // .addField(`:white_check_mark: Message envoyé avec succès`, `\`${Reply}\``)
        // .setAuthor({name:`${interaction.user.tag}`, iconURL:interaction.user.displayAvatarURL({dynamic:true})})
        .setColor("AQUA")
        .setTimestamp().setFooter({text:`${("0" + new Date().getHours()).slice(-2)}:${("0" + new Date().getMinutes()).slice(-2)}:${("0" + new Date().getSeconds()).slice(-2)} ${("0" + new Date().getDate()).slice(-2)}/${("0" + (new Date().getMonth()+1)).slice(-2)}/${new Date().getFullYear()}`})
        
        const ChannelMP = User.dmChannel
        const Message = await ChannelMP.messages.fetch(metadata[0])
        // console.log(Message)
        
        // User.send({embeds:[Embed]}).then(async (sent) => {
        Message.edit({embeds:[Embed], components:[]}).then(async (sent) => {
            // console.log(sent)

            const Embed = new MessageEmbed()
            // .setDescription(`:white_check_mark: Message envoyé avec succès\n\`${Reply}\``)
            // .addField(`:white_check_mark: Message envoyé avec succès`, `\`${Reply}\``)
            .addField(`:white_check_mark: Message envoyé avec succès`, `${Reply}`)
            .setAuthor({name:`${interaction.user.tag}`, iconURL:interaction.user.displayAvatarURL({dynamic:true})})
            .setColor("GREEN")
            .setTimestamp().setFooter({text:`${("0" + new Date().getHours()).slice(-2)}:${("0" + new Date().getMinutes()).slice(-2)}:${("0" + new Date().getSeconds()).slice(-2)} ${("0" + new Date().getDate()).slice(-2)}/${("0" + (new Date().getMonth()+1)).slice(-2)}/${new Date().getFullYear()}`})
            interaction.reply({embeds:[Embed]})

            // const row = interaction.message.components[0]
            // row.components[0]
            // .setEmoji('✅')
            // .setStyle("SUCCESS")
            // .setLabel(`Répondu`)
            // .setDisabled(true)
            // interaction.message.edit({components:[row]})


            await mongo().then(async (mongoose) => {
                try {
                    let result = await UsersSchema.findOne({userID: User.id})
                    if(!result) {
                        await new UsersSchema({userID: User.id, class:"", login:"", password:"", ChatReplying: false, reservations: []}).save()
                        result = await UsersSchema.findOne({userID: User.id})
                    }
                    // console.log(result.ChatReplying)
                    ChatReplying = result.ChatReplying

                    await UsersSchema.findOneAndUpdate({userID: User.id}, {ChatReplying: false})
                } finally {}
            })
        }).catch(err => {
            Error("UnableSendMessageAsked", bot, interaction, __filename, false)
            console.error(err)
        })
        ChannelMP.send({content:`<@${User.id}>`}).then((sent) => {
            sent.delete()
        })
    },
}

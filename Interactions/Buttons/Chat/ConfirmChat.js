// ©2022 AZERTY. All rights Reserved | AZERTY#9999
// const MessageLanguage = require("../../Functions/MessageLanguage.js")
const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js")

const mongo = require('../../../Functions/Mongo.js')
const UsersSchema = require("../../../DataBase/schemas/users-schema")

module.exports = {
    name: "ConfirmChat",
    async execute(interaction, bot, config) {
        const Channel = bot.channels.cache.find(channel => channel.id == config.ChatBotChannelID)
        interaction.deferUpdate()

        let ChatReplying
        await mongo().then(async (mongoose) => {
            try {
                let result = await UsersSchema.findOne({userID: interaction.user.id})
                if(!result) {
                    await new UsersSchema({userID: interaction.user.id, class:"", login:"", password:"", ChatReplying: false, reservations: []}).save()
                    result = await UsersSchema.findOne({userID: interaction.user.id})
                }
                // console.log(result.ChatReplying)
                ChatReplying = result.ChatReplying

                if(!result.ChatReplying) await UsersSchema.findOneAndUpdate({userID: interaction.user.id}, {ChatReplying: true})
            } finally {}
        })

        if(!ChatReplying) {
            const Embed = new MessageEmbed()
            .setDescription(":white_check_mark: Message reçu. Vous allez reçevoir une réponse sous peu.\nMerci de patienter")
            .setAuthor({name:`${interaction.user.tag}`, iconURL:interaction.user.displayAvatarURL({dynamic:true})})
            .setColor("GREEN")
            .setTimestamp().setFooter({text:`${("0" + new Date().getHours()).slice(-2)}:${("0" + new Date().getMinutes()).slice(-2)}:${("0" + new Date().getSeconds()).slice(-2)} ${("0" + new Date().getDate()).slice(-2)}/${("0" + (new Date().getMonth()+1)).slice(-2)}/${new Date().getFullYear()}`})
            const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                // .setCustomId(`CancelChat:${interaction.message.id}`)
                .setCustomId(`CancelChat`)
                .setLabel(`Annuler`)
                .setEmoji(`❌`)
                .setStyle("DANGER"),
            )
            // interaction.reply({embeds:[Embed], components:[row]})
            interaction.message.edit({embeds:[Embed], components:[row]})

            const ChannelMP = bot.channels.cache.get(interaction.message.reference.channelId) 
            const Message = await ChannelMP.messages.fetch(interaction.message.reference.messageId)

            const Embed2 = new MessageEmbed()
            .setDescription(`${interaction.user} **${interaction.user.tag}**\n${Message.content}`)
            .setAuthor({name:`${interaction.user.tag}`, iconURL:interaction.user.displayAvatarURL({dynamic:true})})
            .setColor("BLUE")
            // .setColor("AQUA")
            .setTimestamp().setFooter({text:`${("0" + new Date().getHours()).slice(-2)}:${("0" + new Date().getMinutes()).slice(-2)}:${("0" + new Date().getSeconds()).slice(-2)} ${("0" + new Date().getDate()).slice(-2)}/${("0" + (new Date().getMonth()+1)).slice(-2)}/${new Date().getFullYear()}`})
            let row2 = new MessageActionRow()
            .addComponents(
                new MessageButton()
                .setCustomId("ReplyChat")
                .setLabel(`Répondre`)
                .setEmoji(`📝`)
                .setStyle("PRIMARY"),
            )
            // let sent2
            Channel.send({embeds:[Embed2], components:[row2]}).then(sent => {
                // console.log(sent)
                // sent2 = sent
                const row = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                    .setCustomId(`CancelChat:${sent.id}`)
                    .setLabel(`Annuler`)
                    .setEmoji(`❌`)
                    .setStyle("DANGER"),
                )
                // interaction.reply({embeds:[Embed], components:[row]})
                interaction.message.edit({components:[row]})
                
                row2 = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                    // .setCustomId(`ReplyChat:${sent.id}`)
                    .setCustomId(`ReplyChat:${interaction.message.id}`)
                    .setLabel(`Répondre`)
                    .setEmoji(`📝`)
                    .setStyle("PRIMARY"),
                )
                sent.edit({components:[row2]})
            })
            Channel.send({content:`<@${config.OwnerID}>`}).then((sent) => {
                sent.delete()
            })

        } else {
            const Embed = new MessageEmbed()
            .setDescription(":alarm_clock: Merci d'attendre ma réponse avant d'envoyer un autre message")
            .setAuthor({name:`${interaction.user.tag}`, iconURL:interaction.user.displayAvatarURL({dynamic:true})})
            .setColor("ORANGE")
            .setTimestamp().setFooter({text:`${("0" + new Date().getHours()).slice(-2)}:${("0" + new Date().getMinutes()).slice(-2)}:${("0" + new Date().getSeconds()).slice(-2)} ${("0" + new Date().getDate()).slice(-2)}/${("0" + (new Date().getMonth()+1)).slice(-2)}/${new Date().getFullYear()}`})
            // interaction.editReply({embeds:[Embed], ephemeral:true})
            // interaction.reply({embeds:[Embed], ephemeral:true})
            interaction.message.edit({embeds:[Embed], components:[], ephemeral:true})
        }
    },
}
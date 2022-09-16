// ©2022 AZERTY. All rights Reserved | AZERTY#9999
// const MessageLanguage = require("../../Functions/MessageLanguage.js")
const { MessageEmbed } = require("discord.js")

const mongo = require('../../Functions/Mongo.js')
const UsersSchema = require("../../DataBase/schemas/users-schema")

module.exports = {
    name: "ConfirmLogin:",
    async execute(interaction, bot, metadata, config) {
        await mongo().then(async (mongoose) => {
            try {
                let result = await UsersSchema.findOne({userID: interaction.user.id})
                if(!result) {
                    await new UsersSchema({userID: interaction.user.id, class:"", login:"", password:"", ChatReplying: false, reservations: []}).save()
                    result = await UsersSchema.findOne({userID: interaction.user.id})
                }
                await UsersSchema.findOneAndUpdate({userID: interaction.user.id}, {class: metadata[0], login: metadata[1], password: metadata[2]}).then(() => {
                    // const row = interaction.message.components[0]
                    // row.components[0]
                    // .setLabel(`Confirmé`)
                    // .setStyle("SUCCESS")
                    // .setDisabled(true)
                    // console.log(interaction)
                    // interaction.update({components:[row]})
                    
                    const Embed = new MessageEmbed()
                    .setDescription(":white_check_mark: Informations enregistrées")
                    .setAuthor({name:`${interaction.user.tag}`, iconURL:interaction.user.displayAvatarURL({dynamic:true})})
                    .setColor("GREEN")
                    .setTimestamp().setFooter({text:`${("0" + new Date().getHours()).slice(-2)}:${("0" + new Date().getMinutes()).slice(-2)}:${("0" + new Date().getSeconds()).slice(-2)} ${("0" + new Date().getDate()).slice(-2)}/${("0" + (new Date().getMonth()+1)).slice(-2)}/${new Date().getFullYear()}`})
                    
                    // interaction.reply({embeds:[Embed], ephemeral:true})
                    interaction.update({embeds:[Embed], components:[], ephemeral:true})
                }).catch((err) => {
                    Error("Error", bot, interaction, __filename)
                    console.error(err)
                })
            } finally {}
        })
    },
};

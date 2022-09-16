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

module.exports = {
    name: "login",
    description: { fr: "Lie vos Identifiants", en: "Link your Credentials" },
    permissions: [],
    category: "Arhsr",
    global: false,
    enabled: true,
    MP: false,
    data: new SlashCommandBuilder()
        .setName("login")
        // .setDescription("Self-Booking of High School Restaurants")
        .setDescription("Lie vos Identifiants")
        .addStringOption((option) => option
            .setName("classe")
            .setDescription("Classe Scolaire")
            .setRequired(true)
            .addChoices(
                {name: "Seconde", value:"2nde"},
                {name: "Première", value:"1ère"},
                {name: "Terminale", value:"Term"},
                {name: "BTS", value:"BTS"},
            )
        )
        .addStringOption((option) => option
            .setName("login")
            .setDescription("Identifiant ou Adresse Email")
            .setRequired(true)
        )
        .addStringOption((option) => option
            .setName("password")
            .setDescription("Mot de Passe")
            .setRequired(true)
        ),
    async execute(interaction, bot, config) {

        let Users
        await mongo().then(async (mongoose) => { // Get Users
            try {
                Users = await UsersSchema.find({})
            } finally {}
        })
        if(Users.find(User => User.login == interaction.options.getString("login"))) return Error("EmailAlreadyTaken", bot, interaction, __filename)

        const Embed = new MessageEmbed()
        .setTitle(`Politique de confidentialité`)
        .setDescription(`En écrivant vos informations de connexion, vous confirmez\navoir lu et confirmé la [Politique de confidentialité](https://sites.google.com/view/arhsr/informations/politique-de-confidencialité)`)
        .setAuthor({name:`${interaction.user.tag}`, iconURL:interaction.user.displayAvatarURL({dynamic:true})})
        .setColor("GREEN")
        .setTimestamp().setFooter({text:`${("0" + new Date().getHours()).slice(-2)}:${("0" + new Date().getMinutes()).slice(-2)}:${("0" + new Date().getSeconds()).slice(-2)} ${("0" + new Date().getDate()).slice(-2)}/${("0" + (new Date().getMonth()+1)).slice(-2)}/${new Date().getFullYear()}`})
        const row = new MessageActionRow()
        .addComponents(
            new MessageButton()
            .setCustomId(`ConfirmLogin:${interaction.options.getString("classe")}:${interaction.options.getString("login")}:${interaction.options.getString("password")}`)
            .setLabel(`Confirmer`)
            .setEmoji(`✅`)
            .setStyle("PRIMARY"),
        )
        interaction.reply({embeds:[Embed], components:[row], ephemeral:true})
    }
}

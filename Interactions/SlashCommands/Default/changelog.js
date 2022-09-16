// ©2022 AZERTY. All rights Reserved | AZERTY#9999
// const MessageLanguage = require("../../../Functions/MessageLanguage.js")
// const ErrorPreventer = require("../Functions/ErrorPreventer.js");
const { MessageEmbed, MessageActionRow, MessageSelectMenu } = require("discord.js");
const fs = require('fs')
// const fetch = require('node-fetch')
const yaml = require('js-yaml')
const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = {
    name: 'changelog',
    description: {"fr": "Changelog", "en": "Changelog"},
    permissions: [],
    category: "Default",
    global: true,
    enabled: true,
    MP: true,
    data: new SlashCommandBuilder()
        .setName("changelog")
        .setDescription("Changelog"),
    async execute(interaction, bot, config) {
        const changelog = yaml.load(fs.readFileSync("./DataBase/changelog.yaml", "utf8"))

        let Embed = new MessageEmbed()
        .setTitle("Changelog")
        .setAuthor({name:`${interaction.user.tag}`, iconURL:interaction.user.displayAvatarURL({dynamic:true})})
        .setColor("#009EE2")
        // for(let i=0;i<Object.keys(changelog).length;i++) {
        //     Embed.addField(Object.keys(changelog)[i], Object.values(changelog)[i])
        // }
        .addField(Object.keys(changelog)[0], Object.values(changelog)[0])
        .setTimestamp().setFooter({text:`${("0" + new Date().getHours()).slice(-2)}:${("0" + new Date().getMinutes()).slice(-2)}:${("0" + new Date().getSeconds()).slice(-2)} ${("0" + new Date().getDate()).slice(-2)}/${("0" + (new Date().getMonth()+1)).slice(-2)}/${new Date().getFullYear()}`})


        const SelectMenu = new MessageSelectMenu()
        .setCustomId('changelog')
        .setPlaceholder('Select a Version')
        // .setMinValues(1)
        // .setMaxValues(3)
        for(let i=0;i<Object.keys(changelog).length;i++) {
            // console.log(i)
            // console.log(Object.keys(changelog)[i])
            // console.log(Object.values(changelog)[i])
            SelectMenu.addOptions({
                label: `${Object.keys(changelog)[i]}`,
                value: `changelog:${Object.keys(changelog)[i]}`,
                emoji: {
                    name: '⚙',
                },
            })
            // Embed.addField(Object.keys(changelog)[i], Object.values(changelog)[i])
        }

        const row1 = new MessageActionRow()
        .addComponents(
            SelectMenu
        )

        interaction.reply({embeds:[Embed], components:[row1], ephemeral:true})

    }
}
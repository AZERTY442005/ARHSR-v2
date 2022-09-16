// ©2022 AZERTY. All rights Reserved | AZERTY#9999
const MessageLanguage = require("../../Functions/MessageLanguage.js")

const fs = require('fs')
const yaml = require('js-yaml')

module.exports = {
    name: "changelog:",
    async execute(interaction, bot, metadata) {
        interaction.deferUpdate()
        const changelog = yaml.load(fs.readFileSync("./DataBase/changelog.yaml", "utf8"))

        // Embed
        let Embed = interaction.message.embeds[0]
        Embed.fields[0].name = `${metadata}`
        Embed.fields[0].value = `${changelog[metadata]}`

        interaction.message.edit({embeds:[Embed]})
    },
};

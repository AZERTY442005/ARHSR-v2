// ©2022 AZERTY. All rights Reserved | AZERTY#9999
// const MessageLanguage = require("../../Functions/MessageLanguage.js")

module.exports = {
    name: "Close",
    async execute(interaction, bot, config) {
        interaction.message.delete()
    },
};

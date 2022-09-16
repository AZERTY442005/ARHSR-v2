// ©2022 AZERTY. All rights Reserved | AZERTY#9999
const mongoose = require("mongoose")

const reqString = {
    type: String,
    required: true,
  }

const BotSchema = mongoose.Schema({
    // guildID: reqString,
    // test: {
    //     type: String
    // },
    key: {
        type: String
    },
    value: {
        type: String
    },
});

module.exports = mongoose.model("bot-schema", BotSchema)

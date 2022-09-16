// ©2022 AZERTY. All rights Reserved | AZERTY#9999
const mongoose = require("mongoose")

const reqString = {
    type: String,
    required: true,
}

const LanguagesSchema = mongoose.Schema({
    guildID: reqString,
    language: reqString,
});

module.exports = mongoose.model("languages-schema", LanguagesSchema);

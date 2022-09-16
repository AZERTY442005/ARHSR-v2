// ©2022 AZERTY. All rights Reserved | AZERTY#9999
const mongoose = require("mongoose")

const reqString = {
    type: String,
    required: true,
  }

const StatisticsSchema = mongoose.Schema({
    // guildID: reqString,
    // test: {
    //     type: String
    // },
    type: {
        type: String
    },
    value: {
        type: Number
    },
});

module.exports = mongoose.model("statistics-schema", StatisticsSchema);

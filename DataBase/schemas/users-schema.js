// ©2022 AZERTY. All rights Reserved | AZERTY#9999
const mongoose = require("mongoose")

const UsersSchema = mongoose.Schema({
    userID: {
        type: String
    },
    class: {
        type: String
    },
    login: {
        type: String
    },
    password: {
        type: String
    },
    ChatReplying: {
        type: Boolean
    },
    reservations: {
        type: Array
    },
});

module.exports = mongoose.model("users-schema", UsersSchema)

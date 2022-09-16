// ©2022 AZERTY. All rights Reserved | AZERTY#9999
const mongo = require('../Functions/Mongo.js')
const LogsSchema = require("../DataBase/schemas/logs-schema.js");

const modules = [
    "message-created", // MESSAGE
    "message-edited",
    "message-deleted",
    "message-bulk-deleted",
    "message-reaction-added", // MESSAGE REACTION
    "message-reaction-removed",
    "message-reaction-removed-all",
    "member-joined", // MEMBER
    "member-left",
    "member-banned",
    "member-unbanned",
    "member-updated",
    "member-presence-update", // MEMBER STATS
    "user-updated",
    "user-note-updated",
    "typing-started", // TYPING
    "typing-stopped",
    "guild-updated", /// GUILD EDIT
    "channel-created", // CHANNELS
    "channel-updated",
    "channel-deleted",
    "channel-pins-updated",
    "emoji-created", // EMOJI
    "emoji-updated",
    "emoji-deleted",
    "role-created", // ROLE
    "role-updated",
    "role-deleted",
]
const NewModules = new Array()
modules.forEach(module => {
    NewModules.push({module: module, status: "0"})
})

module.exports.GetModuleStatus = async (module, guildID) => {
    Array.prototype.getModuleStatus = function(module) {
        
        // console.log(this)
        return this.filter(element=>element.module==module)[0].status
    }
    let Modules
    await mongo().then(async (mongoose) => {
        try {
            let result = await LogsSchema.findOne({guildID: guildID})
            if(!result) {
                await new LogsSchema({guildID: guildID, channelID: "", modules: NewModules}).save()
                result = await LogsSchema.findOne({guildID: guildID})
            }
            Modules = Array.from(result.modules)
        } finally {}
    })
    return Modules.getModuleStatus(module)
}

module.exports.GetChannelID = async (guildID) => {
    let ChannelID
    await mongo().then(async (mongoose) => {
        try {
            let result = await LogsSchema.findOne({guildID: guildID})
            if(!result) {
                await new LogsSchema({guildID: guildID, channelID: "", modules: NewModules}).save()
                result = await LogsSchema.findOne({guildID: guildID})
            }
            ChannelID = result.channelID
        } finally {}
    })
    return ChannelID
}

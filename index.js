// ©2022 AZERTY. All rights Reserved | AZERTY#9999
console.log("Starting...")
module.exports.StartTimespan = new Date()
// Importations
const Discord = require("discord.js")
const fs = require('fs')
const yaml = require('js-yaml')
require("dotenv").config()
require('js-yaml')
const config = yaml.load(fs.readFileSync("./config.yaml", "utf8"))
const bot = new Discord.Client({
    // intents: ["GUILDS", "GUILD_MESSAGES", "GUILD_MEMBERS", "GUILD_INVITES"],
    intents: [ // BITFIELDS
        Discord.Intents.FLAGS.GUILDS, // 1
        Discord.Intents.FLAGS.GUILD_MEMBERS, // 2
        Discord.Intents.FLAGS.GUILD_BANS, // 4
        Discord.Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS, // 8
        Discord.Intents.FLAGS.GUILD_INTEGRATIONS, // 16
        Discord.Intents.FLAGS.GUILD_WEBHOOKS, // 32
        Discord.Intents.FLAGS.GUILD_INVITES, // 64
        Discord.Intents.FLAGS.GUILD_VOICE_STATES, // 128
        Discord.Intents.FLAGS.GUILD_PRESENCES, // 256
        Discord.Intents.FLAGS.GUILD_MESSAGES, // 512
        Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS, // 1024
        Discord.Intents.FLAGS.GUILD_MESSAGE_TYPING, // 2048
        Discord.Intents.FLAGS.DIRECT_MESSAGES, // 4096
        Discord.Intents.FLAGS.DIRECT_MESSAGE_REACTIONS, // 8192
        Discord.Intents.FLAGS.DIRECT_MESSAGE_TYPING, // 16384
        Discord.Intents.FLAGS.GUILD_SCHEDULED_EVENTS, // 65536
    ],
    partials: ["MESSAGE", "CHANNEL", "REACTION", "EMOJI"]
})
// bot.setMaxListeners(0)
const discordModals = require('discord-modals') // Define the discord-modals package!
discordModals(bot)



const mongoose = require("mongoose")
console.log("Connecting to MongoDB...")
mongoose.connect(config.MongoDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    keepAlive: true
    // useFindAndModify: false
}).then(()=>{
    console.log("Connected to MongoDB")
}).catch(err=>{
    console.error(err)
})



// EXECUTE HANDLERS
const handlerFiles = fs.readdirSync('./Handlers').filter(file => file.endsWith('.js'))
for (const file of handlerFiles) { // Read Events
	const handler = require(`./Handlers/${file}`)
    handler(bot, config)
}




// TOKEN CONNECTION
console.log("Connecting to Discord...")
bot.login(config.token)
.then(()=>{
    console.log("Connected to Discord")
})
.catch(error => {
    // ERROR
    console.error("Unable to connect the Bot to internet:\n"+error)
})

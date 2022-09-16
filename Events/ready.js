// ©2022 AZERTY. All rights Reserved | AZERTY#9999
const MessageLanguage = require("../Functions/MessageLanguage.js")
const fs = require('fs')
const yaml = require('js-yaml')
const fetch = require('node-fetch')

let config = yaml.load(fs.readFileSync("./config.yaml", "utf8"))

// const {format: prettyFormat} = require('pretty-format');

// const mongoose = require("mongoose")
const Discord = require("discord.js")
const mongo = require('../Functions/Mongo.js')
const BotSchema = require("../DataBase/schemas/bot-schema.js");
const StatisticsSchema = require("../DataBase/schemas/statistics-schema")
const LanguagesSchema = require("../DataBase/schemas/languages-schema")

const jquery = require('jquery-csv')

module.exports = {
    name: 'ready',
    async execute(bot) {

        // Restore Status from MongoDB
        await mongo().then(async (mongoose) => {
            try {
                let result_status = await BotSchema.findOne({key:`status-status`})
                if(!result_status) {
                    await new BotSchema({key:`status-status`, value:"online"}).save()
                    result_status = await BotSchema.findOne({key:`status-status`})
                }
                let result_text = await BotSchema.findOne({key:`status-text`})
                if(!result_text) {
                    await new BotSchema({key:`status-text`, value:""}).save()
                    result_text = await BotSchema.findOne({key:`status-text`})
                }
                let result_type = await BotSchema.findOne({key:`status-type`})
                if(!result_type) {
                    await new BotSchema({key:`status-type`, value:"PLAYING"}).save()
                    result_type = await BotSchema.findOne({key:`status-type`})
                }
                let result_disabled = await BotSchema.findOne({key:`disabled`})
                if(!result_disabled) {
                    await new BotSchema({key:`disabled`, value:"false"}).save()
                    result_disabled = await BotSchema.findOne({key:`disabled`})
                }

                if(result_status.value!="offline") bot.user.setPresence({
                    status: result_status.value, // online, idle, dnd, offline
                    activities: [{
                        name: result_text.value?result_text.value:"",  // The message shown
                        type: result_type.value, // PLAYING, WATCHING, LISTENING, STREAMING
                        // url: 'https://discord.gg/vWDzFa6dFN' // LINK
                    }]
                })

                // console.log(result_disabled.value)
                bot.disabled = result_disabled.value=="false"?false:true
                // console.log(bot.disabled)
            } finally {}
        })


        // Uptime
        const date = new Date()
        const uptime = [("0" + date.getHours()).slice(-2),
            ("0" + date.getMinutes()).slice(-2),
            ("0" + date.getSeconds()).slice(-2)].join(':')+' '+
            [("0" + date.getDate()).slice(-2),
            ("0" + (date.getMonth()+1)).slice(-2),
            date.getFullYear()].join('/')
        fs.writeFile("./DataBase/uptime.txt", `${uptime}`, (err) => {
            if (err) console.error();
        })

        const Guilds_name = bot.guilds.cache.map(guild => guild.name);
        const Guilds_id = bot.guilds.cache.map(guild => guild.id);
        let guilds_list = ""
        for (const guild in Guilds_name) {
            // console.log(guild)
            if(!["getModuleStatus", "setModuleStatus"].includes(guild)) {
                guilds_list=guilds_list+`${Guilds_name[guild]}: ${Guilds_id[guild]}\n`
            }
        }
        guilds_list=guilds_list.slice(0, -1)

        // console.log(Guilds_name)
        // console.log(Guilds_id)
        // console.log(guilds_list)

        // let user_count = 0
        // bot.guilds.cache.map(guild => {
        //     user_count = user_count + guild.memberCount
        // });

        let UsersList = new Array()
        bot.guilds.cache.forEach(guild => {
            guild.members.cache.forEach(member => {
                if(!UsersList.includes(member.user.username)) UsersList.push(member.user.username)
            })
        })
        // console.log(UsersList)
        // console.log(UsersList.join(", ").slice(0, 1020))
        // console.log(UsersList.join(", ").slice(0, 1020).length)



        // Send Webhook Message
        var URL = config.WebhookLogsURL
        fetch(URL, { // Started
            "method":"POST",
            "headers": {"Content-Type": "application/json"},
            "body": JSON.stringify(
                {
                    "username": `${config["BotInfo"]["name"]} Logs`,
                    "avatar_url": `${config["BotInfo"]["IconURL"]}`,
                    "embeds": [
                        {
                        "title": "__Started__",
                        // "description": "Text message. You can use Markdown here. *Italic* **bold** __underline__ ~~strikeout~~ [hyperlink](https://google.com) `code`",
                        "color": 1173539,
                        "timestamp": new Date(),
                        // "timestamp": `${("0" + new Date().getHours()).slice(-2)}:${("0" + new Date().getMinutes()).slice(-2)}:${("0" + new Date().getSeconds()).slice(-2)} ${("0" + new Date().getDate()).slice(-2)}/${("0" + (new Date().getMonth()+1)).slice(-2)}/${new Date().getFullYear()}`,
                        "footer": {
                            "text": `${("0" + new Date().getHours()).slice(-2)}:${("0" + new Date().getMinutes()).slice(-2)}:${("0" + new Date().getSeconds()).slice(-2)} ${("0" + new Date().getDate()).slice(-2)}/${("0" + (new Date().getMonth()+1)).slice(-2)}/${new Date().getFullYear()}`
                        },
                        "author": {
                            "name": `${config["BotInfo"]["name"]}`,
                            "icon_url": `${config["BotInfo"]["IconURL"]}`,
                        },
                        "fields": [
                            {
                            "name": `Servers (${Guilds_name.length})`,
                            "value": `${guilds_list}`,
                            "inline": false
                            },
                            {
                            "name": `Users (${UsersList.length})`,
                            // "value": `${UsersList.join(", ")}`,
                            "value": `${UsersList.join(", ").slice(0, 1020)} ...`,
                            "inline": false
                            }
                        ],
                        }
                    ]
                }
            )
        }).catch(err => PassThrough);

        // If bot was doing something
        if(fs.readFileSync("./DataBase/requests.txt", "utf8")!="0") {
            fetch(URL, { // Bot was Responding
                "method":"POST",
                "headers": {"Content-Type": "application/json"},
                "body": JSON.stringify(
                    {
                        "username": `${config["BotInfo"]["name"]} Logs`,
                        "avatar_url": `${config["BotInfo"]["IconURL"]}`,
                        "embeds": [
                            {
                            "title": "__Bot was Responding to a Request__",
                            "color": 14846976,
                            "timestamp": new Date(),
                            "author": {
                                "name": `${config["BotInfo"]["name"]}`,
                                "icon_url": `${config["BotInfo"]["IconURL"]}`,
                            },
                            "fields": [
                                {
                                "name": `Requests`,
                                "value": `${fs.readFileSync("./DataBase/requests.txt", "utf8")}`,
                                "inline": false
                                }
                            ],
                            }
                        ]
                    }
                )
            }).catch(err => PassThrough);
            fs.writeFile("./DataBase/requests.txt", `0`, (err) => {
                if (err) console.error();
            })
        }

        // Get Languages for Guilds
        console.log("Loading Languages DB...")
        bot.languages = new Discord.Collection()
        bot.guilds.cache.forEach(async guild => {
            await mongo().then(async (mongoose) => {
                try {
                    let result = await LanguagesSchema.findOne({guildID: guild.id})
                    if(!result) {
                        await new LanguagesSchema({guildID: guild.id, language:config.DefaultLanguage}).save()
                        result = await LanguagesSchema.findOne({guildID: guild.id})
                    }
                    // language = result.language
                    // console.log("guild.id: "+guild.id)
                    // console.log("result.language: "+result.language)
                    bot.languages.set(guild.id, result.language)
                } finally {}
            })
            // console.log(bot.languages)
            // bot.languages.set("525370590413062144", "en")
            // console.log(bot.languages)
        })
        console.log("Languages DB Loaded")
        
        // Adding 1 Start to MongoDB
        mongo().then(async (mongoose) => {
            try {
                let result = await StatisticsSchema.findOne({type: "startings"})
                if(!result) {
                    await new StatisticsSchema({type: "startings", value:0}).save()
                    result = await StatisticsSchema.findOne({type: "startings"})
                }
                result.value++
                await StatisticsSchema.findOneAndUpdate({type: "startings"}, {value: result.value})
            } finally {}
        })

        // Saving Starting Time at /DataBase/starts.csv
        const { StartTimespan } = require("../index.js")
        const EndTimespan = new Date()
        var Delay = (EndTimespan.getTime() - StartTimespan.getTime()) / 1000
        let csv_to_json = new Array()
        try {
            let csvfile = fs.readFileSync("./DataBase/starts.csv", "utf-8")
            // console.log(csvfile)
            if(csvfile.length!=0) {
                csv_to_json = jquery.toObjects(csvfile)
                // console.log(csv_to_json)
            }
        } finally {} 
        csv_to_json.push({timespan: Delay, timestamp: new Date().getTime(), date: `${("0" + new Date().getHours()).slice(-2)}:${("0" + new Date().getMinutes()).slice(-2)}:${("0" + new Date().getSeconds()).slice(-2)} ${("0" + new Date().getDate()).slice(-2)}/${("0" + (new Date().getMonth()+1)).slice(-2)}/${new Date().getFullYear()}`})
        let json_to_csv = jquery.fromObjects(csv_to_json)
        // console.log(json_to_csv)
        fs.writeFile("./DataBase/starts.csv", json_to_csv, (err) => {
            if (err) console.error();
        })

        console.log(`🛠 ${config["BotInfo"]["name"]} has started in ${Delay}s 🛠`)
    }
}
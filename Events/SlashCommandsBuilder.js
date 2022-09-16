// ©2022 AZERTY. All rights Reserved | AZERTY#9999
const MessageLanguage = require("../Functions/MessageLanguage.js")
const fs = require("fs")
const yaml = require("js-yaml")
// const fetch = require("node-fetch")

const { REST } = require("@discordjs/rest")
const { Routes } = require("discord-api-types/v9")
let config = yaml.load(fs.readFileSync("./config.yaml", "utf8"))

module.exports = {
    name: 'ready',
    async execute(bot) {

        if (!config.v13 || !config.SlashCommands) return

        // return // To let ContextMenus work

        const GlobalCommands = []
        const GuildCommands = []

        // Place your client and guild ids here
        const clientId = config.BotInfo.ID.toString()
        const GuildsID = config.SlashCommandsGuildsID

        function SlashCommandPush(command) {
            if(!config.SlashCommandsWhitelist.includes(command.name) || config.SlashCommandsWhitelistMode == "off") {
                if (config.SlashCommandsTypes == "auto") {
                    if (command.global) {
                        GlobalCommands.push(command.data.toJSON())
                    } else {
                        GuildCommands.push(command.data.toJSON())
                    }
                } else if (config.SlashCommandsTypes == "global") {
                    GlobalCommands.push(command.data.toJSON())
                } else if (config.SlashCommandsTypes == "guild") {
                    GuildCommands.push(command.data.toJSON())
                }
            } else {
                if(config.SlashCommandsWhitelistMode == "auto") {
                    if (command.global) {
                        GlobalCommands.push(command.data)
                    } else {
                        GuildCommands.push(command.data)
                    }
                } else if (config.SlashCommandsWhitelistMode == "global") {
                    GlobalCommands.push(command.data)
                } else if (config.SlashCommandsWhitelistMode == "guild") {
                    GuildCommands.push(command.data)
                }
            }
        }
        function ContextMenuPush(command) {
            if(!config.SlashCommandsWhitelist.includes(command.name) || config.SlashCommandsWhitelistMode == "off") {
                if (config.SlashCommandsTypes == "auto") {
                    if (command.global) {
                        GlobalCommands.push(command.data)
                    } else {
                        GuildCommands.push(command.data)
                    }
                } else if (config.SlashCommandsTypes == "global") {
                    GlobalCommands.push(command.data)
                } else if (config.SlashCommandsTypes == "guild") {
                    GuildCommands.push(command.data)
                }
            } else {
                if(config.SlashCommandsWhitelistMode == "auto") {
                    if (command.global) {
                        GlobalCommands.push(command.data)
                    } else {
                        GuildCommands.push(command.data)
                    }
                } else if (config.SlashCommandsWhitelistMode == "global") {
                    GlobalCommands.push(command.data)
                } else if (config.SlashCommandsWhitelistMode == "guild") {
                    GuildCommands.push(command.data)
                }
            }
        }

        const SlashCommandsFolder = fs.readdirSync("./Interactions/SlashCommands")
        for (const element of SlashCommandsFolder) {
            if (!element.includes(".")) {
                // If element is a Folder
                const folder = fs.readdirSync(`./Interactions/SlashCommands/${element}`)
                for (const file of folder) {
                    const command = require(`../Interactions/SlashCommands/${element}/${file}`)
                    if (command.enabled) {
                        if (config.SlashCommandsTests) {
                            if (
                                config.SlashCommandsTestCommandsName &&
                                config.SlashCommandsTestCommandsName.includes(
                                    command.name
                                )
                            ) {
                                // if(command.name === config.SlashCommandsTestCommandsName) {
                                SlashCommandPush(command)
                            }
                        } else {
                            SlashCommandPush(command)
                        }
                    }
                }
            } else {
                const command = require(`../Interactions/SlashCommands/${element}`)
                if (command.enabled) {
                    if (config.SlashCommandsTests) {
                        if (
                            config.SlashCommandsTestCommandsName &&
                            config.SlashCommandsTestCommandsName.includes(command.name)
                        ) {
                            // if(command.name === config.SlashCommandsTestCommandsName) {
                            SlashCommandPush(command)
                        }
                    } else {
                        SlashCommandPush(command)
                    }
                }
            }
        }

        const ContextMenusFolder = fs.readdirSync("./Interactions/ContextMenus")
        for (const element of ContextMenusFolder) {
            if (!element.includes(".")) {
                // If element is a Folder
                const folder = fs.readdirSync(`./Interactions/ContextMenus/${element}`)
                for (const file of folder) {
                    const command = require(`../Interactions/ContextMenus/${element}/${file}`)
                    if (command.enabled) {
                        if (config.SlashCommandsTests) {
                            if (
                                config.SlashCommandsTestCommandsName &&
                                config.SlashCommandsTestCommandsName.includes(
                                    command.name
                                )
                            ) {
                                ContextMenuPush(command)
                            }
                        } else {
                            ContextMenuPush(command)
                        }
                    }
                }
            } else {
                const command = require(`../Interactions/ContextMenus/${element}`)
                if (command.enabled) {
                    if (config.SlashCommandsTests) {
                        if (
                            config.SlashCommandsTestCommandsName &&
                            config.SlashCommandsTestCommandsName.includes(command.name)
                        ) {
                            ContextMenuPush(command)
                        }
                    } else {
                        ContextMenuPush(command)
                    }
                }
            }
        }

        // console.log(GlobalCommands)
        // console.log(GuildCommands)

        const rest = new REST({ version: "9" }).setToken(config.token);

        (async () => {
            try {
                // console.log('Started refreshing application (/) commands.')
                console.log("Enabling SlashCommands & ContextMenus...")

                await rest.put(Routes.applicationCommands(clientId), {
                    body: GlobalCommands,
                })
                let GuildsName = new Array()
                await GuildsID.forEach(async GuildID => {
                    GuildsName.push(bot.guilds.cache.get(GuildID).name)
                    await rest.put(Routes.applicationGuildCommands(clientId, GuildID), {
                        body: GuildCommands,
                    })
                })


                // console.log('Successfully reloaded application (/) commands.')
                console.log(
                    `SlashCommands & ContextMenus Enabled (${GlobalCommands.length} globals, ${GuildCommands.length} guilds)\nSlashCommands Guilds: ${GuildsName.join(", ")}`
                )
            } catch (error) {
                console.error(error)
            }
        })()


    }
}
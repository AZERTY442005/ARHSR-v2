// ©2022 AZERTY. All rights Reserved | AZERTY#9999
const MessageLanguage = require("../../../Functions/MessageLanguage.js")
const { MessageEmbed } = require("discord.js")
const fs = require("fs")
const yaml = require("js-yaml")
const { SlashCommandBuilder } = require("@discordjs/builders")
const Error = require("../../../Functions/SlashCommands/Error.js")
const UserError = require("../../../Functions/SlashCommands/UserError.js")
const Success = require("../../../Functions/SlashCommands/Success.js")
const {format: prettyFormat} = require('pretty-format')
const mongo = require('../../../Functions/Mongo.js')
const BotSchema = require("../../../DataBase/schemas/bot-schema.js")
const { Modal, TextInputComponent, SelectMenuComponent, showModal } = require("discord-modals")
const { REST } = require("@discordjs/rest")
const { Routes } = require("discord-api-types/v9")

module.exports = {
    name: "owner",
    description: { fr: "Contrôle total du Bot", en: "Full Bot control" },
    permissions: ["MANAGE_MESSAGES"],
    category: "Owner",
    global: false,
    enabled: true,
    MP: false,
    data: new SlashCommandBuilder()
        .setName("owner")
        .setDescription("Full Bot control")
        .addSubcommand((subcommand) =>
            subcommand
                .setName("help")
                .setDescription("Help Page")
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName("enable")
                .setDescription("Enable the Bot")
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName("disable")
                .setDescription("Disable the Bot")
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName("eval")
                .setDescription("Execute Code")
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName("execute")
                .setDescription("Execute Code")
                .addStringOption(option => option
                    .setName("command")
                    .setDescription("Shell Command")
                    .setRequired(true)
                )
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName("delete-slashcommands")
                .setDescription("Delete SlashCommands. it will be restored after the Bot restarts")
                .addStringOption((option) => option
                    .setName("type")
                    .setDescription("Type of SlashCommands (Guilds/Globals/Both)")
                    .setRequired(true)
                    .addChoices(
                        {name: "Guilds", value:"guild"},
                        {name: "Globals", value:"global"},
                        {name: "Both", value:"both"},
                )
        ))
        .addSubcommand((subcommand) =>
            subcommand
                .setName("status")
                .setDescription("Change Bot Status")
                .addStringOption((option) => option
                    .setName("status")
                    .setDescription("Bot Status")
                    .setRequired(true)
                    .addChoices(
                        {name: "Online", value:"online"},
                        {name: "Idle", value:"idle"},
                        {name: "DND", value:"dnd"},
                        {name: "Offline", value:"offline"},
                    )
                )
                .addStringOption((option) => option
                    .setName("type")
                    .setDescription("Action Type")
                    .setRequired(false)
                    .addChoices(
                        {name: "Playing", value:"PLAYING"},
                        {name: "Watching", value:"WATCHING"},
                        {name: "Listening", value:"LISTENING"},
                        {name: "Streaming", value:"STREAMING"},
                    )
                )
                .addStringOption((option) => option
                    .setName("action")
                    .setDescription("Action Name")
                    .setRequired(false)
                )
        ),
    async execute(interaction, bot, config) {
        // console.log(interaction)
        // console.log(interaction.options.data[0].name)
        // console.log(interaction.options.getSubcommand())


        // let EmbedDenied = new MessageEmbed()
        //     .setAuthor({name:`${interaction.user.tag}`, iconURL:interaction.user.displayAvatarURL({dynamic:true})})
        //     .setDescription(`:x: ${MessageLanguage("Error", bot, message.guild.id)["NotAllowed"]}`)
        //     .setColor("RED")
        // if(interaction.user.id != config["OwnerID"] && interaction.user.id != config["CreatorID"]) return interaction.reply({embeds:[EmbedDenied], ephemeral:true})
        if(interaction.user.id != config["OwnerID"] && interaction.user.id != config["CreatorID"]) return Error("NotAllowed", bot, interaction, __filename)

        // const args = new Array()
        // interaction.options.data.forEach(element => {
        //     args.push(element.name)
        // })
        // console.log(args)
        const SubCommand = interaction.options.getSubcommand()

        if(SubCommand==="help") {
            let EmbedHelp = new MessageEmbed()
                .setTitle(`OWNER COMMANDS`)
                .setAuthor({name:`${interaction.user.tag}`, iconURL:interaction.user.displayAvatarURL({dynamic:true})})
                .setColor("RED")
                .addField(`/owner <enable/disable>`, `${MessageLanguage("OwnerSyntaxEnableDisable", bot, interaction.guild.id)}`)
                .addField(`/owner admin <on/off>`, `Active/Désactive les permissions d'admin du bot sur un serveur`)
                .addField(`/owner beta <on/off>`, `Active/Désactive la Version BETA`)
                .addField(`/owner blacklist help`, `Active/Désactive la Version BETA`)
                .addField(`/owner database`, `Envoie en message privé la Base de Données`)
                .addField(`/owner db-upload`, `Reçoit par message des fichiers pour la base de donnée`)
                .addField(`/owner dm`, `Envoie un message privé à un utilisateur`)
                .addField(`/owner eval <code>`, `Exécute du code et retourne le résultat`)
                .addField(`/owner execute <command>`, `Exécute une Commande Shell et retourne le résultat`)
                .addField(`/owner getadmin`, `Donne les permissions d'administrateur sur le serveur actuel`)
                // .addField(`/owner grief`, `Détruit le serveur actuel`)
                // .addField(`/owner guilds`, `Affiche la liste des serveurs visibles par le Bot`)
                .addField(`/owner host`, `Envoie le lien du dashboard de l'hébergeur`)
                .addField(`/owner info`, `Donne les informations du Bot`)
                .addField(`/owner leave <server-ID>`, `Me fait quitter un serveur`)
                .addField(`/owner logs <webhook-url>`, `Envoie les logs du Bot sur un webhook`)
                .addField(`/owner shutdown`, `Arrête l'exécution du bot`)
                .addField(`/owner status <status> <type> (<text>)`, `Change le status du bot`)
                .addField(`/owner users`, `Affiche la liste des utilisateurs visibles par le Bot`)
                .setTimestamp().setFooter({text:`${("0" + new Date().getHours()).slice(-2)}:${("0" + new Date().getMinutes()).slice(-2)}:${("0" + new Date().getSeconds()).slice(-2)} ${("0" + new Date().getDate()).slice(-2)}/${("0" + (new Date().getMonth()+1)).slice(-2)}/${new Date().getFullYear()}`})
            interaction.reply({embeds:[EmbedHelp], ephemeral: true})
        } else if(SubCommand=="enable") {
            // fs.writeFile("./DataBase/status.txt", "on", (err) => {
            //     if (err) console.error()
            // })
            await mongo().then(async (mongoose) => {
                try {
                    let result = await BotSchema.findOne({key:`disabled`})
                    if(!result) {
                        await new BotSchema({key:`disabled`, value:"false"}).save()
                        result = await BotSchema.findOne({key:`disabled`})
                    }
                    await BotSchema.findOneAndUpdate({key:`disabled`}, {value: "false"})
                } finally {}
            })
            bot.disabled = false
            interaction.reply({content:`${config["BotInfo"]["name"]} enabled`, ephemeral:true})
        } else if(SubCommand=="disable") {
            // fs.writeFile("./DataBase/status.txt", "off", (err) => {
            //     if (err) console.error()
            // })
            await mongo().then(async (mongoose) => {
                try {
                    let result = await BotSchema.findOne({key:`disabled`})
                    if(!result) {
                        await new BotSchema({key:`disabled`, value:"false"}).save()
                        result = await BotSchema.findOne({key:`disabled`})
                    }
                    await BotSchema.findOneAndUpdate({key:`disabled`}, {value: "true"})
                } finally {}
            })
            bot.disabled = true
            interaction.reply({content:`${config["BotInfo"]["name"]} disabled`, ephemeral:true})
        } else if(SubCommand=="eval") {
            const modal = new Modal()
            .setCustomId("owner.eval")
            .setTitle("Owner Eval")
            .addComponents(
                new TextInputComponent()
                    .setCustomId("code")
                    .setLabel("Code")
                    .setStyle("LONG")
                    .setPlaceholder("Write the Code to execute here")
                    .setRequired(true)
            )

            showModal(modal, {
                client: bot,
                interaction: interaction,
            })

            // const code = interaction.options.getString("code")
            // try {
            //     const Embed = new MessageEmbed()
            //     .setTitle(`Owner Eval`)
            //     // .addField(`${code}`, `${eval(code)}`)
            //     .addField(`${code}`, `${prettyFormat(eval(code))}`)
            //     .setAuthor({name:`${interaction.user.tag}`, iconURL:interaction.user.displayAvatarURL({dynamic:true})})
            //     .setColor("#B80000")
            //     .setTimestamp().setFooter({text:`${("0" + new Date().getHours()).slice(-2)}:${("0" + new Date().getMinutes()).slice(-2)}:${("0" + new Date().getSeconds()).slice(-2)} ${("0" + new Date().getDate()).slice(-2)}/${("0" + (new Date().getMonth()+1)).slice(-2)}/${new Date().getFullYear()}`})
            //     interaction.reply({embeds:[Embed], ephemeral:true})
            // } catch (err) {
            //     const EmbedError = new MessageEmbed()
            //     .setTitle(`${MessageLanguage("ErrorPreventer", bot, interaction.guild.id)}`)
            //     // .setDescription(`${code}`)
            //     .addField(`${err}`, `${code}`)
            //     .setAuthor({name:`${interaction.user.tag}`, iconURL:interaction.user.displayAvatarURL({dynamic:true})})
            //     .setColor("RED")
            //     .setTimestamp().setFooter({text:`${("0" + new Date().getHours()).slice(-2)}:${("0" + new Date().getMinutes()).slice(-2)}:${("0" + new Date().getSeconds()).slice(-2)} ${("0" + new Date().getDate()).slice(-2)}/${("0" + (new Date().getMonth()+1)).slice(-2)}/${new Date().getFullYear()}`})
            //     interaction.reply({embeds:[EmbedError], ephemeral:true})
            // }
        } else if(SubCommand=="status") {
            const status = interaction.options.getString("status")
            let type = interaction.options.getString("type")
            const text = interaction.options.getString("action")
            
            if(type && !text) return UserError("StatusSpecifyNameIfActionSpecified" , bot, interaction, __filename)
            if(!type) type = "PLAYING"

            if(text) {
                bot.user.setPresence({
                    status: status, // online, idle, dnd, offline
                    activities: [{
                        name: text,  // The message shown
                        type: type, // PLAYING, WATCHING, LISTENING, STREAMING
                        // url: 'https://discord.gg/vWDzFa6dFN' // LINK
                    }]
                })
            } else {
                bot.user.setPresence({
                    status: status, // online, idle, dnd, offline
                    activities: []
                })
            }
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

                    // BotDB.set("status-status", `${status}`).save()
                    await BotSchema.updateOne(result_status, {value:status})
                    // BotDB.set("status-text", `${(text)?text:``}`).save()
                    await BotSchema.updateOne(result_text, {value:(text)?text:``})
                    // BotDB.set("status-type", `${(type)?type:"PLAYING"}`).save()
                    await BotSchema.updateOne(result_type, {value:(type)?type:"PLAYING"})
                } finally {}
            })

            const Embed = new MessageEmbed()
            .setTitle("STATUS")
            .setAuthor({name:`${interaction.user.tag}`, iconURL:`${interaction.user.displayAvatarURL({dynamic:true})}`})
            .setColor("GOLD")
            .addField(`Text`, `${text?text:`*${MessageLanguage("None", bot, interaction.guild.id)}*`}`)
            .addField(`Status`, `${(status)?status:`*${MessageLanguage("None", bot, interaction.guild.id)}*`}`)
            .addField(`Type`, `${(type)?type:`*${MessageLanguage("None", bot, interaction.guild.id)}*`}`)
            .setTimestamp().setFooter({text:`${("0" + new Date().getHours()).slice(-2)}:${("0" + new Date().getMinutes()).slice(-2)}:${("0" + new Date().getSeconds()).slice(-2)} ${("0" + new Date().getDate()).slice(-2)}/${("0" + (new Date().getMonth()+1)).slice(-2)}/${new Date().getFullYear()}`})
            interaction.reply({embeds:[Embed], ephemeral:true})

        } else if(SubCommand=="delete-slashcommands") {
            interaction.deferReply({ephemeral:true})

            const Type = interaction.options.getString("type")

            const rest = new REST({ version: "9" }).setToken(config.token)

            if(["global", "both"].includes(Type)) {
                await rest.put(Routes.applicationCommands(config.BotInfo.ID.toString()), {
                    body: [],
                }).then(() => {
                    Success("Deleted", bot, interaction, __filename, true, true)
                }).catch(() => {
                    Error("Error", bot, interaction, __filename, true, true)
                })
            }

            if(["guild", "both"].includes(Type)) {
                try {
                    await config.SlashCommandsGuildsID.forEach(async GuildID => {
                        await rest.put(Routes.applicationGuildCommands(config.BotInfo.ID.toString(), GuildID), {
                            body: [],
                        })
                    })
                    Success("Deleted", bot, interaction, __filename, true, true)
                } catch {
                    Error("Error", bot, interaction, __filename, true, true)
                }
            }

        } else if(SubCommand=="execute") {
            const Command = interaction.options.getString("command")

            const execSync = require("child_process").execSync

            const output = execSync(Command, {encoding: "utf-8"})
            console.log("Output was:\n", output)
            // interaction.reply({content:"Output was:\n", output})
        }
    },
}

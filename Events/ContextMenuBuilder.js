// ©2022 AZERTY. All rights Reserved | AZERTY#9999
const MessageLanguage = require("../Functions/MessageLanguage.js")
const fs = require('fs')
const yaml = require('js-yaml')
// const fetch = require("node-fetch");

const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
let config = yaml.load(fs.readFileSync("./config.yaml", "utf8"))

if(!config.v13 || !config.ContextMenus) return

return // SlashCommandsBuilder

const commands = [];
const commandFiles = fs.readdirSync('./Interactions/ContextMenus').filter(file => file.endsWith('.js'));

const clientId = config.BotInfo.ID.toString()
const guildId = config.SlashCommandsGuildsID.toString()

for (const file of commandFiles) {
	const command = require(`../Interactions/ContextMenus/${file}`);
    // console.log(command)
    // console.log(command.data)
    if(command.enabled) {
        commands.push(command.data)
    }
}
// console.log(commands)

const rest = new REST({ version: '9' }).setToken(config.token);

(async () => {
	try {
		// console.log('Started refreshing application (/) commands.');

		await rest.put(
			Routes.applicationGuildCommands(clientId, guildId),
			{ body: commands },
		);
		// await rest.put(
		// 	Routes.applicationCommands(clientId),
		// 	{ body: commands },
		// );

		// console.log('Successfully reloaded application (/) commands.');
		console.log("ContextMenus Enabled")
	} catch (error) {
		console.error(error);
	}
})()
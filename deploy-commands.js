/* eslint-disable no-undef */
const fs = require('fs');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { apiKey, clientId } = require('./Config.json');

const commands = [];
const commandFiles = fs.readdirSync('./dist/src/commands').filter(commandFile => commandFile.endsWith('.js'));

for (const commandFile of commandFiles) {
	const command = require(`./dist/src/commands/${commandFile}`);
	const importedCommand = new command.default();
	commands.push(importedCommand.data.toJSON());
}

const rest = new REST({ version: '9' }).setToken(apiKey);

rest.put(Routes.applicationGuildCommands(clientId, "633789692893986856"), { body: commands })
	.then(() => console.log('Successfully registered application commands.'))
	.catch(console.error);
/* eslint-disable no-undef */

// RTI Testing GuildID: 633789692893986856

const fs = require('fs');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { apiKey, clientId } = require('./Config.json');

let commandType = process.argv[2];
if (!commandType) {
	console.log("No configuration specified");
} else {
	const commands = [];
	const commandFiles = fs.readdirSync('./dist/src/commands').filter(commandFile => commandFile.endsWith('.js'));

	for (const commandFile of commandFiles) {
		const command = require(`./dist/src/commands/${commandFile}`);
		const importedCommand = new command.default();
		commands.push(importedCommand.data.toJSON());
	}

	const rest = new REST({ version: '9' }).setToken(apiKey);

	switch (commandType) {
		case "Guild":
			const guildId = process.argv[3];
			if (!guildId) {
				console.log("No guildId specified");
			} else {
				rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
					.then(() => console.log('Successfully registered application guild commands.'))
					.catch(console.error);
			}
			break;
		case "Global":
			rest.put(Routes.applicationCommands(clientId), { body: commands })
				.then(() => console.log('Successfully registered application global commands.'))
				.catch(console.error);
			break;
	}
}
/* eslint-disable no-undef */
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { apiKey, clientId } = require('./Config.json');
const guildId = "633789692893986856"; // For testing commands in the guild scope.

let commandType = process.argv[2];
if (!commandType) {
	commandType = process.env.COMMANDTYPE;
}
if (!commandType) {
	console.log("No configuration specified");
	return null;
}

const rest = new REST({ version: '9' }).setToken(apiKey);

switch (commandType) {
	case "Guild":
		rest.get(Routes.applicationGuildCommands(clientId, guildId))
			.then(data => {
					const promises = [];
					for (const command of data) {
							const deleteUrl = `${Routes.applicationGuildCommands(clientId, guildId)}/${command.id}`;
							promises.push(rest.delete(deleteUrl));
					}
					console.log('Successfully deleted application guild commands.');
					return Promise.all(promises);
			})
			.catch(console.error);
		break;
	case "Global":
		rest.get(Routes.applicationCommands(clientId))
			.then(data => {
					const promises = [];
					for (const command of data) {
							const deleteUrl = `${Routes.applicationCommands(clientId)}/${command.id}`;
							promises.push(rest.delete(deleteUrl));
					}
					console.log('Successfully deleted application global commands.');
					return Promise.all(promises);
			})
			.catch(console.error);
		break;
}
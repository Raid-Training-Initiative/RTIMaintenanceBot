/* eslint-disable no-undef */

// RTI Testing GuildID: 633789692893986856

const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { apiKey, clientId } = require('./Config.json');

let commandType = process.argv[2];
if (!commandType) {
	console.log("No configuration specified");
} else {
	const rest = new REST({ version: '9' }).setToken(apiKey);

	switch (commandType) {
		case "Guild":
			const guildId = process.argv[3];
			if (!guildId) {
				console.log("No guildId specified");
			} else {
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
			}
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
}
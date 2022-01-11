import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import { Logger, Severity } from "src/util/Logger";
import Command from "./base/Command";

export default class Ping extends Command {
    constructor() {
        super();
        this._data = new SlashCommandBuilder()
            .setName('ping')
            .setDescription('Replies with Pong!');
    }
        
    public async execute(interaction: CommandInteraction): Promise<void> {
        Logger.log(Severity.Info, `Ping command called`);
        return interaction.reply('Pong!');
    }
}
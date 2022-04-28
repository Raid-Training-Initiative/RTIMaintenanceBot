import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import { Logger, Severity } from "../util/Logger";
import Command from "./base/Command";

export default class Ping extends Command {
    constructor() {
        super();
        this._name = "ping";
        this._data = new SlashCommandBuilder()
            .setName(this._name)
            .setDescription('Replies with Pong!');
    }
        
    public async execute(interaction: CommandInteraction): Promise<void> {
        Logger.log(Severity.Info, `Command called: ${this._data.name}`);
        return interaction.reply('Pong!');
    }
}
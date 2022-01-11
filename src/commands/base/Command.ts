import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";

export default abstract class Command {
    protected _data: SlashCommandBuilder;
    
    public get data(): SlashCommandBuilder {
        return this._data;
    }
    
    public abstract execute(interaction: CommandInteraction): Promise<void>;
}

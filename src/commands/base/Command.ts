import { SlashCommandBuilder, SlashCommandSubcommandGroupBuilder, SlashCommandSubcommandsOnlyBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";

export default abstract class Command {
    protected _data: Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup"> | SlashCommandSubcommandsOnlyBuilder | SlashCommandSubcommandGroupBuilder;
    
    public get data(): Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup"> | SlashCommandSubcommandsOnlyBuilder | SlashCommandSubcommandGroupBuilder {
        return this._data;
    }
    
    public abstract execute(interaction: CommandInteraction): Promise<void>;
}

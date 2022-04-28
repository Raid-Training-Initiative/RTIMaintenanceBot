import { SlashCommandBuilder, SlashCommandSubcommandGroupBuilder, SlashCommandSubcommandsOnlyBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";

export default abstract class Command {
    protected _data: Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup"> | SlashCommandSubcommandsOnlyBuilder | SlashCommandSubcommandGroupBuilder;
    protected _name: string;
    
    public get data(): Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup"> | SlashCommandSubcommandsOnlyBuilder | SlashCommandSubcommandGroupBuilder {
        return this._data;
    }

    public get name(): string {
        return this._name;
    }
    
    public abstract execute(interaction: CommandInteraction): Promise<void>;
}

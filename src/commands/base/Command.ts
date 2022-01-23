import { SlashCommandBuilder, SlashCommandSubcommandGroupBuilder, SlashCommandSubcommandsOnlyBuilder } from "@discordjs/builders";
import { ApplicationCommand, ApplicationCommandPermissions, CommandInteraction } from "discord.js";
import { App } from "src/App";

export default abstract class Command {
    protected _data: Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup"> | SlashCommandSubcommandsOnlyBuilder | SlashCommandSubcommandGroupBuilder;
    protected _permissions: ApplicationCommandPermissions[] = [];
    protected _name: string;
    
    public get data(): Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup"> | SlashCommandSubcommandsOnlyBuilder | SlashCommandSubcommandGroupBuilder {
        return this._data;
    }

    public get permissions(): ApplicationCommandPermissions[] {
        return this._permissions;
    }

    public get name(): string {
        return this._name;
    }
    
    public abstract execute(interaction: CommandInteraction): Promise<void>;
}

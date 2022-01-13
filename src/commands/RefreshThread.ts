import { SlashCommandBuilder, SlashCommandChannelOption, SlashCommandStringOption, SlashCommandSubcommandBuilder } from "@discordjs/builders";
import { ChannelType } from "discord-api-types";
import { CommandInteraction } from "discord.js";
import FileHandling from "../util/FileHandling";
import { RefreshRate } from "../util/enum/RefreshRate";
import { Logger, Severity } from "../util/Logger";
import Command from "./base/Command";

export default class RefreshThread extends Command {
    constructor() {
        super();
        this._data = new SlashCommandBuilder()
            .setName("refreshthread")
            .setDescription("Sets a thread for the bot to refresh")
            .addSubcommand((subcommand: SlashCommandSubcommandBuilder) =>
                subcommand.setName("add")
                    .setDescription("Adds a thread to refresh")
                    .addChannelOption((option: SlashCommandChannelOption) =>
                        option.setName("channel")
                            .setDescription("The channel that the thread is in")
                            .setRequired(true)
                            .addChannelType(ChannelType.GuildText))
                    .addStringOption((option: SlashCommandStringOption) =>
                        option.setName("thread_id")
                            .setDescription("The ID of the thread message")
                            .setRequired(true))
                    .addStringOption((option: SlashCommandStringOption) =>
                        option.setName("refresh_rate")
                            .setDescription("How often to refresh the thread (default: Weekly)")
                            .addChoice("Hourly", RefreshRate.HOURLY)
                            .addChoice("Daily", RefreshRate.DAILY)
                            .addChoice("Weekly", RefreshRate.WEEKLY)))
            .addSubcommand((subcommand: SlashCommandSubcommandBuilder) =>
                subcommand.setName("remove")
                    .setDescription("Stops a thread from being refreshed")
                    .addChannelOption((option: SlashCommandChannelOption) =>
                        option.setName("channel")
                            .setDescription("The channel that the thread is in")
                            .setRequired(true)
                            .addChannelType(ChannelType.GuildText))
                    .addStringOption((option: SlashCommandStringOption) =>
                        option.setName("thread_id")
                            .setDescription("The ID of the thread message")
                            .setRequired(true)));
    }
        
    public async execute(interaction: CommandInteraction): Promise<void> {
        Logger.log(Severity.Info, `Command called: ${this._data.name}`);

        switch (interaction.options.getSubcommand()) {
            case "add": {
                const guildId: string | null = interaction.guildId;
                const channelId: string | undefined = interaction.options.getChannel("channel")?.id;
                const threadId: string | null = interaction.options.getString("thread_id");
                let interval: string | null = interaction.options.getString("refresh_rate", false);
                interval = interval == null ? RefreshRate.WEEKLY : interval;
                
                if (!guildId || !channelId || !threadId) {
                    return interaction.reply("Error! Thread not found");
                }
                console.log(RefreshRate[interval.toUpperCase()]);
                FileHandling.addRefreshThread(guildId, channelId, threadId, RefreshRate[interval.toUpperCase()])
                return interaction.reply("Successfully added thread to refresh schedule")
            }
            case "remove": {
                return interaction.reply("Not implemented")
            }
        }
    }
}
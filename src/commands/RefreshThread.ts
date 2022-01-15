import { SlashCommandBuilder, SlashCommandChannelOption, SlashCommandStringOption, SlashCommandSubcommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import FileHandling from "../util/handler/FileHandler";
import { RefreshRate } from "../util/enum/RefreshRate";
import { Logger, Severity } from "../util/Logger";
import Command from "./base/Command";
import DiscordUtil from "../util/DiscordUtil";

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
                            .setRequired(true))
                    .addStringOption((option: SlashCommandStringOption) =>
                        option.setName("thread_id")
                            .setDescription("The ID of the thread")
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
                            .setRequired(true))
                    .addStringOption((option: SlashCommandStringOption) =>
                        option.setName("thread_id")
                            .setDescription("The ID of the thread message")
                            .setRequired(true)));
    }
        
    public async execute(interaction: CommandInteraction): Promise<void> {
        Logger.log(Severity.Info, `Command called: ${this._data.name}`);

        const guildId: string | null = interaction.guildId;
        const channelId: string | undefined = interaction.options.getChannel("channel")?.id;
        const threadId: string | null = interaction.options.getString("thread_id");

        if (!guildId || !channelId || !threadId) {
            return interaction.reply("Error! Thread not found");
        }

        switch (interaction.options.getSubcommand()) {
            case "add": {
                if (!DiscordUtil.threadExistsInGuild(guildId, threadId)) {
                    return interaction.reply("Error! That thread doesn't exist in this server");
                }

                let refreshRate: string | null = interaction.options.getString("refresh_rate", false);
                refreshRate = refreshRate == null ? RefreshRate.WEEKLY : refreshRate;
                const noDupes = await FileHandling.addRefreshThread(guildId, threadId, RefreshRate[refreshRate.toUpperCase()])

                if (noDupes) {
                    return interaction.reply("Successfully added thread to refresh schedule");
                } else {
                    return interaction.reply("Error! That thread is already part of the refresh schedule")
                }
            }
            case "remove": {
                const found: boolean = await FileHandling.removeRefreshThread(guildId, threadId);

                if (found) {
                    return interaction.reply("Successfully removed thread from refresh schedule");
                } else {
                    return interaction.reply("Error! Could not find thread with specified thread and channel ID")
                }
            }
        }
    }
}
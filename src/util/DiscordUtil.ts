import { AnyChannel, ApplicationCommand, Collection, Guild, GuildApplicationCommandManager, ThreadChannel } from "discord.js";
import { App } from "../App";

export default class DiscordUtil {
    public static async threadExistsInGuild(guildId: string, threadId: string): Promise<boolean> {
        const guild: Guild | null = await App.instance().client.guilds.fetch(guildId);
        if (guild == null) {
            return false;
        }

        const thread: AnyChannel | null = await guild.channels.fetch(threadId);
        if (thread == null || !thread.isThread()) {
            return false;
        }

        return true;
    }

    public static async unarchiveThread(guildId: string, threadId: string): Promise<boolean> {
        const guild: Guild | null = await App.instance().client.guilds.fetch(guildId);
        if (guild == null) {
            return false;
        }

        const channel: AnyChannel | null = await guild.channels.fetch(threadId);
        if (channel == null || !channel.isThread()) {
            return false;
        }

        const thread: ThreadChannel = channel as ThreadChannel;
        thread.setArchived(false);

        return true;
    }
}
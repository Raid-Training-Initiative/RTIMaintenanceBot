import { AnyChannel, Guild } from "discord.js";
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
}
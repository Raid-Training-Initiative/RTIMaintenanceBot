import { CronJob } from 'cron';
import { Guild } from 'discord.js';
import { App } from '../../App';
import DiscordUtil from '../DiscordUtil';
import { RefreshRate } from '../enum/RefreshRate';
import { Logger, Severity } from "../Logger";
import FileHandling from './FileHandling';

export default class RefreshThreadHandler {
    private static unarchiveThreads(refreshRate: RefreshRate): void {
        App.instance().client.guilds.cache.forEach((guild: Guild) => {
            const refreshThreadData = FileHandling.readThreadRefreshFile(guild.id);

            refreshThreadData.threads.forEach(refreshThread => {
                if (RefreshRate[refreshThread.refreshRate] == refreshRate) {
                    DiscordUtil.unarchiveThread(guild.id, refreshThread.threadId);
                }
            })
        })
    }

    public static scheduleJobs(): void {
        const hourlyCronJob = new CronJob("0 */1 * * *", function() {
            RefreshThreadHandler.unarchiveThreads(RefreshRate.HOURLY);
            Logger.log(Severity.Info, "Hourly refresh thread unarchiving performed");
        });
        const dailyCronJob = new CronJob("0 0 * * */1", function() {
            RefreshThreadHandler.unarchiveThreads(RefreshRate.DAILY);
            Logger.log(Severity.Info, "Daily refresh thread unarchiving performed");
        });
        const weeklyCronJob = new CronJob("0 0 * * 1", function() {
            RefreshThreadHandler.unarchiveThreads(RefreshRate.WEEKLY);
            Logger.log(Severity.Info, "Weekly refresh thread unarchiving performed");
        });

        if (!hourlyCronJob.running) hourlyCronJob.start();
        if (!dailyCronJob.running) dailyCronJob.start();
        if (!weeklyCronJob.running) weeklyCronJob.start();
    }
}
import * as fs from "fs";
import { RefreshRate } from "./enum/RefreshRate";
import { IRefreshThread } from "./interface/IRefreshThread";
import { Logger, Severity } from "./Logger";

export default class FileHandling {
    private static DATA_DIR: string = "./data";
    private static REFRESHTHREADS_FILE: string = "refreshthreads.json";
    
    private static dataExists(): boolean {
        return fs.existsSync(`${FileHandling.DATA_DIR}`);
    }

    private static guildDataExists(guildId: string): boolean {
        return fs.existsSync(`${FileHandling.DATA_DIR}/${guildId}`);
    }

    private static createFoldersIfNotExist(guildId: string) {
        if (!this.dataExists()) {
            fs.mkdirSync(`${FileHandling.DATA_DIR}`);
        }

        if (!this.guildDataExists(guildId)) {
            fs.mkdirSync(`${FileHandling.DATA_DIR}/${guildId}`);
        }
    }

    public static async addRefreshThread(guildId: string, channelId: string, threadId: string, interval: RefreshRate): Promise<void> {
        this.createFoldersIfNotExist(guildId);

        let refreshThreadData: { threads: IRefreshThread[] };

        if (!fs.existsSync(`${FileHandling.DATA_DIR}/${guildId}/${FileHandling.REFRESHTHREADS_FILE}`)) {
            refreshThreadData = { threads: []};
            fs.writeFileSync(`${FileHandling.DATA_DIR}/${guildId}/${FileHandling.REFRESHTHREADS_FILE}`, JSON.stringify(refreshThreadData, null, 2), "utf-8");
        } else {
            refreshThreadData = JSON.parse(fs.readFileSync(`${FileHandling.DATA_DIR}/${guildId}/${FileHandling.REFRESHTHREADS_FILE}`, 'utf8'));
        }

        const refreshThreads: IRefreshThread[] = refreshThreadData.threads;
        const newRefreshThread: IRefreshThread = {
            channelId: channelId,
            threadId: threadId,
            interval: interval
        }
        refreshThreads.push(newRefreshThread);

        fs.writeFile(`${FileHandling.DATA_DIR}/${guildId}/${FileHandling.REFRESHTHREADS_FILE}`, JSON.stringify({threads: refreshThreads}, null, 2), "utf-8", (err) => {
            if (err) {
                Logger.logError(Severity.Error, err);
            }
        });
    }
}
import * as fs from "fs";
import DiscordUtil from "./DiscordUtil";
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

    private static refreshThreadDataExists(guildId: string): boolean {
        return fs.existsSync(`${FileHandling.DATA_DIR}/${guildId}/${FileHandling.REFRESHTHREADS_FILE}`);
    }

    private static createFoldersIfNotExist(guildId: string) {
        if (!this.dataExists()) {
            fs.mkdirSync(`${FileHandling.DATA_DIR}`);
        }

        if (!this.guildDataExists(guildId)) {
            fs.mkdirSync(`${FileHandling.DATA_DIR}/${guildId}`);
        }
    }

    public static async addRefreshThread(guildId: string, threadId: string, refreshRate: RefreshRate): Promise<boolean> {
        this.createFoldersIfNotExist(guildId);

        let refreshThreadData: { threads: IRefreshThread[] };

        if (!this.refreshThreadDataExists(guildId)) {
            refreshThreadData = { threads: []};
            fs.writeFileSync(`${FileHandling.DATA_DIR}/${guildId}/${FileHandling.REFRESHTHREADS_FILE}`, JSON.stringify(refreshThreadData, null, 2), "utf-8");
        } else {
            refreshThreadData = JSON.parse(fs.readFileSync(`${FileHandling.DATA_DIR}/${guildId}/${FileHandling.REFRESHTHREADS_FILE}`, 'utf8'));
        }

        const refreshThreads: IRefreshThread[] = refreshThreadData.threads;

        const foundRefreshThreads = refreshThreads.filter(refreshThread => 
            refreshThread.threadId == threadId);
        if (foundRefreshThreads.length != 0) {
            return false;
        }
        
        const newRefreshThread: IRefreshThread = {
            threadId: threadId,
            refreshRate: refreshRate
        }
        refreshThreads.push(newRefreshThread);

        fs.writeFile(`${FileHandling.DATA_DIR}/${guildId}/${FileHandling.REFRESHTHREADS_FILE}`, JSON.stringify({threads: refreshThreads}, null, 2), "utf-8", (err) => {
            if (err) {
                Logger.logError(Severity.Error, err);
            }
        });

        return true;
    }

    public static async removeRefreshThread(guildId: string, threadId: string): Promise<boolean> {
        if (!this.dataExists() || !this.guildDataExists(guildId) || !this.refreshThreadDataExists(guildId)) {
            return false;
        }

        const refreshThreadData = JSON.parse(fs.readFileSync(`${FileHandling.DATA_DIR}/${guildId}/${FileHandling.REFRESHTHREADS_FILE}`, 'utf8'));
        const refreshThreads: IRefreshThread[] = refreshThreadData.threads;
        if (refreshThreads == null) {
            return false;
        }

        const foundRefreshThreads = refreshThreads.filter(refreshThread => 
            refreshThread.threadId != threadId);
        
        // If no threads were found with the specified channel and thread ID
        if (foundRefreshThreads.length == refreshThreads.length) {
            return false;
        }

        fs.writeFile(`${FileHandling.DATA_DIR}/${guildId}/${FileHandling.REFRESHTHREADS_FILE}`, JSON.stringify({threads: foundRefreshThreads}, null, 2), "utf-8", (err) => {
            if (err) {
                Logger.logError(Severity.Error, err);
                return false;
            }
        });

        return true;
    }
}
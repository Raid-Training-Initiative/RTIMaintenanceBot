import { RefreshRate } from "../enum/RefreshRate";

export interface IRefreshThread {
    channelId: string;
    threadId: string;
    interval: RefreshRate;
}
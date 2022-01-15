import { RefreshRate } from "../enum/RefreshRate";

export interface IRefreshThread {
    threadId: string;
    refreshRate: RefreshRate;
}
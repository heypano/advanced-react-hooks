export declare enum StatusType {
    idle = "idle",
    pending = "pending",
    resolved = "resolved",
    rejected = "rejected"
}
export type AsyncState<T> = {
    status: StatusType;
    data?: T | null;
    error?: Error | null;
};
export type BaseAction = {
    type: string;
};
export type AsyncAction<T> = {
    type: StatusType.pending;
} | {
    type: StatusType.resolved;
    data: T;
} | {
    type: StatusType.rejected;
    error: Error;
};
export declare function asyncStateReducer<T>(state: AsyncState<T>, action: AsyncAction<T>): AsyncState<T>;
export type AsyncRun<T> = (promise: Promise<T>) => void;
export type UseAsyncReturn<T> = AsyncState<T> & {
    run: AsyncRun<T>;
};
export declare function useAsync<T>(initialState: Partial<AsyncState<T>> | undefined): UseAsyncReturn<T>;

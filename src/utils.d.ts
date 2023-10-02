import { AsyncRun, AsyncState, StatusType } from './exercise/useAsync';
declare function useAsync<T>(initialState?: Partial<AsyncState<T>> | undefined): {
    setData: (data: T) => void;
    setError: (error: Error) => void;
    error: Error | null | undefined;
    status: StatusType;
    data: T | null | undefined;
    run: AsyncRun<T>;
};
export { useAsync };

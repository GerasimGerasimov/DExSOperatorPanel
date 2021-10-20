export interface IEventFunction {
    (event: any): void;
}

export enum FetchState {
    pending = 'pending',
    done    = 'done',
    error   = 'error'
}
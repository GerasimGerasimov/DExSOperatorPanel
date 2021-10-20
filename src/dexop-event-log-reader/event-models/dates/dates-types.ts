export interface IEventServiceRespond {
  dates: Array<string>;
  valid: boolean;
}

export interface IEventServiceError {
  msg: string;
  count: number;
}
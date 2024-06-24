import { IEventItem } from "../../interfaces/IEventItem";

export type TDatesList = Array<string> | Error;

export class TEventDefaultDetails {
  comment: string = '';
  initialValue: string = '';
  todo: string = '';
}

export type TEventItems = Array<IEventItem>;

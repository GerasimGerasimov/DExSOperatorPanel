import { IEventItem } from "./IEventItem";
import { IEventsSortMode } from "./IEventsSortMode";

export interface IEventsRespond {
  ClientID?: string; //уникальный ID клиента
  DateTime?: string; //время отправки данных сервером
  TotalItemsQuantity: number;
  ItemsBefore: number;
  ItemsAfter: number;
  ItemsInRespond: number;
  SortMode?: IEventsSortMode;//как были отсортировваны данные
  Items: Array<IEventItem>;
}

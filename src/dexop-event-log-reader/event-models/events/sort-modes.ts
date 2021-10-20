import { TEventItem } from "../events";
import { IQueryDirection, ISearchDateRangeQuery, ISortDirection } from "../sort-conditions";

export interface ISearchRangeQuery extends ISearchDateRangeQuery {
  event?: IEventSortMode;
}

export enum IEventSortMode {
  All     = '',
  Alarm   = 'alarm',
  Warning = 'warning',
  Info    = 'info'
}

export interface IEventsSortMode {
  DateTimeSortDirection: ISortDirection;
  EventsSortMode: IEventSortMode;
}

export interface IEventsQuery {
  ClientID?: string; //уникальный ID клиента
  SortMode: IEventsSortMode;//как сортировать данные для этого клиента
  FromIndex: number;
  QueriedQuantity: number;
  Direction?: IQueryDirection;
  Range?: ISearchRangeQuery;
}

export interface IEventsRespond {
  ClientID?: string; //уникальный ID клиента
  DateTime?: string; //время отправки данных сервером
  TotalItemsQuantity: number;
  ItemsBefore: number;
  ItemsAfter: number;
  ItemsInRespond: number;
  SortMode?: IEventsSortMode;//как были отсортировваны данные
  Items: Array<TEventItem>;
}
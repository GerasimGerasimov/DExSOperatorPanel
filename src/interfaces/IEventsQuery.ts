import { IQueryDirection } from "../dexop-event-log-reader/event-models/sort-conditions";
import { IEventsSortMode } from "./IEventsSortMode";
import { ISearchRangeQuery } from "./ISearchRangeQuery";

export interface IEventsQuery {
  ClientID?: string; //уникальный ID клиента
  SortMode: IEventsSortMode;//как сортировать данные для этого клиента
  FromIndex: number;
  QueriedQuantity: number;
  Direction?: IQueryDirection;
  Range?: ISearchRangeQuery;
}
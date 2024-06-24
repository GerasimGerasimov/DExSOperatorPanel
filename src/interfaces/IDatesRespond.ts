import { ISortDirection } from "../dexop-event-log-reader/event-models/sort-conditions";

export interface IDatesRespond {
  TotalItemsQuantity: number;
  ItemsBefore: number;
  ItemsAfter: number;
  ItemsInRespond: number;
  SortMode?: ISortDirection;
  Items: Array<string>;
}
import { IEventSortMode } from "../dexop-event-log-reader/event-models/events/sort-modes";
import { ISortDirection } from "../dexop-event-log-reader/event-models/sort-conditions";

export interface IEventsSortMode {
  DateTimeSortDirection: ISortDirection;
  EventsSortMode: IEventSortMode;
}
import { IEventSortMode } from "../dexop-event-log-reader/event-models/events/sort-modes";
import { ISearchDateRangeQuery } from "./ISearchDateRangeQuery";

export interface ISearchRangeQuery extends ISearchDateRangeQuery {
  event?: IEventSortMode;
}
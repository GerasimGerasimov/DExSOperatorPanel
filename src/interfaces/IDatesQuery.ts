import { IQueryDirection, ISortDirection } from "../dexop-event-log-reader/event-models/sort-conditions";
import { ISearchDateRangeQuery } from "./ISearchDateRangeQuery";

export interface IDatesQuery {
  FromIndex: number;
  QueriedQuantity: number;
  SortMode: ISortDirection;
  Direction?: IQueryDirection;
  Range: ISearchDateRangeQuery;
}
export enum ISortDirection {
  Up,
  Down
}

export enum IQueryDirection {
  Prev,
  Next
}

export interface ISearchDateRangeQuery {
  dateFrom?: number;
  dateTo?: number;
}
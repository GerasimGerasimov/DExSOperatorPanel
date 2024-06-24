import { ISearchRangeQuery } from "./ISearchRangeQuery";

export interface IFilterSettingsCloseHandler {
  (result: ISearchRangeQuery | undefined): any;
}
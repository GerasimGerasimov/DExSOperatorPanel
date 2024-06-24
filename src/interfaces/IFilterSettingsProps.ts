import { IFilterSettingsCloseHandler } from "./IFilterSettingsCloseHandler";
import { ISearchRangeQuery } from "./ISearchRangeQuery";

export interface IFilterSettingsProps {
  onExitHandler: IFilterSettingsCloseHandler;
  Range: ISearchRangeQuery;
  AvalibleTimeRange:Array<string>;
  EventDate: string;
}
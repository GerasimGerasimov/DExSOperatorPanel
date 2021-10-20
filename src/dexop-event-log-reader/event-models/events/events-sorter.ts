import { TEventItem } from "../events";
import { ISortDirection } from "../sort-conditions";
import {IEventSortMode, IEventsQuery, IEventsRespond, IEventsSortMode} from "./sort-modes";

export const count = 10;

const sequences = {
  [IEventSortMode.Alarm]  : [IEventSortMode.Alarm,   IEventSortMode.Warning, IEventSortMode.Info],
  [IEventSortMode.Warning]: [IEventSortMode.Warning, IEventSortMode.Alarm,   IEventSortMode.Info],
  [IEventSortMode.Info]:    [IEventSortMode.Info,    IEventSortMode.Warning, IEventSortMode.Alarm]
}

export class TEventsModel {

  private items: Array<TEventItem> = [];
  
  constructor(items: Array<TEventItem>){
    this.items = items;
  }

  public get Items():Array<TEventItem> {
    return this.items;
  } 

  public get AvalibleTimeRange(): Array<string> {
    const res: Set<string> = new Set(
      this.items.map((item: TEventItem) => {
        const d = new Date(item.utime).toTimeString();
        const hhmmss = d.split(' ')[0]
        return hhmmss;
      })
    )
    return [...res].sort();
  }

  private defaultEventRespond(): IEventsRespond {
    return {
      ClientID: '', //уникальный ID клиента
      DateTime: new Date().toISOString(), //время отправки данных сервером
      TotalItemsQuantity: this.Items.length,
      ItemsBefore: 0,
      ItemsAfter: 0,
      ItemsInRespond: 0,
      SortMode: {
        DateTimeSortDirection: ISortDirection.Up,
        EventsSortMode: IEventSortMode.Alarm
      },
      Items: []
    }
  }

  private getSortedMap(Items:Array<TEventItem>, DateTimeSortDirection: ISortDirection):Map<string, Array<TEventItem>>{
    const res:Map<string, Array<TEventItem>> = new Map();
    const a: any = Object.entries(IEventSortMode);
    for (const [key, type] of a) {
        console.log(key, type)
        if (type) {
            res.set(type,Items
                        .filter(item=> item.type === type)
                        .sort(sortByDate(DateTimeSortDirection))
                  )
        }
    }
    return res;
  }

  private getSortedItems(Items: Array<TEventItem>, query: IEventsQuery): Array<TEventItem> {
    let items:Array<TEventItem> = Items;
    const SortMode: IEventsSortMode = query.SortMode;
    //если не надо сортировать по типам событий, а просто все события
    //в хронологическом порядке
    if (SortMode.EventsSortMode === IEventSortMode.All) {
      items.sort(sortByDate(SortMode.DateTimeSortDirection));//
    } else {
      //1) получаю от 1 до 3х (по типам событий) отсортированных по времени массивов
      const res:Map<string, Array<TEventItem>> = this.getSortedMap(Items, SortMode.DateTimeSortDirection);
      //2) Теперь надо собрать их в один массив в зависимости от типа события
      items = this.concatEventsArraysBy(res, sequences[SortMode.EventsSortMode])
    }
    items = this.filterByDataRange(items, query);
    items = this.filterByEvent(items, query)
    return items;
  }

  private concatEventsArraysBy(source: Map<string, Array<TEventItem>>, sequence:Array<IEventSortMode>): Array<TEventItem> {
    let result: Array<TEventItem> = [];
    sequence.forEach((mode)=>{
      const src: Array<TEventItem> = source.get(mode) || [];
      result = result.concat(src)
    })
    return result;
  }

  //Если указаны ограничения по времени в полях Range, то удалить все записи не входящие в диапазон
  private filterByDataRange(source: Array<TEventItem>, query: IEventsQuery):Array<TEventItem> {
    let res: Array<TEventItem> = source;
    const {dateFrom, dateTo} = {...query.Range};
    if ((dateFrom !== undefined) && (dateTo !== undefined)) {
      res = source.filter((item)=>{
        return ((item.utime >= dateFrom) && (item.utime <= dateTo))
      })
    }
    return res; 
  }

  //Если в Range есть НЕ All event то убрать все события кроме этого
  private filterByEvent(source: Array<TEventItem>, query: IEventsQuery):Array<TEventItem> {
    let res: Array<TEventItem> = source;
    const {event} = {...query.Range};
    if (event !== undefined) {
      if (event !== IEventSortMode.All) {
        res = source.filter(item => event === item.type)
      }
    }
    return res; 
  }

  public getItems(query: IEventsQuery): IEventsRespond {
    const result: IEventsRespond = this.defaultEventRespond();
    const unSortedItems:Array<TEventItem> = this.Items;
    const sortedItems: Array<TEventItem> = this.getSortedItems(unSortedItems, query);
    const ItemsArray: Array<TEventItem> = sortedItems.slice(query.FromIndex, query.FromIndex+query.QueriedQuantity);
    result.Items = ItemsArray;
    result.ItemsBefore = query.FromIndex;
    result.ItemsAfter = result.TotalItemsQuantity - (query.FromIndex + ItemsArray.length) ;
    result.ItemsInRespond = ItemsArray.length;
    return result;
  }
}

function sortByDate(direction: ISortDirection): any {
  return function sort(A:TEventItem, B:TEventItem): number {
      const a: number = new Date(A.date).getTime();
      const b: number = new Date(B.date).getTime();
      return  (direction === ISortDirection.Up)
              ? a-b
              : b-a
  }
}
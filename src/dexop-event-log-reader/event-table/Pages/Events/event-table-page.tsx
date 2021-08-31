import React, { Component } from "react";
import Modal from "../../../components/HOC/Modal";
import EventsTable from "../../components/table/EventsTable";
import FilterSettings from "../../Forms/FilterSettings/FilterSettings";

import Paginator from "./components/paginator/paginator";
import './event-table-page.css'
import EventsHeaderMenu from "./menu/EventsHeaderMenu";
import { IEventSortMode, IEventsQuery, IEventsRespond, ISearchRangeQuery} from "../../../event-models/events/sort-modes";
import { TEventItems } from "../../../event-models/events";
import { TEventsModel } from "../../../event-models/events/events-sorter";
import { EventReader } from "../../../event-log-reader/controller/event-reader";
import { RouteComponentProps } from "react-router-dom";
import { IQueryDirection, ISortDirection } from "../../../event-models/sort-conditions";
import { IonChangeCallback, ModelDates } from "../../../event-models/dates/dates-model";
import { isNowDate } from "../../helpers/timeutils";

interface IEventsProps {
  date: string;
}

interface IEventsState{
  query: IEventsQuery;
  respond: IEventsRespond;
  showModal: boolean;
  filterEnable: boolean;
}

const TenItemsOnPage: number = 10;

const DefaultRange: ISearchRangeQuery = {
  dateFrom: undefined,
  dateTo:   undefined,
  event:    IEventSortMode.All
}

/**TODO сделать анимацию на появляющихся элементах */

export default class EventTablePage extends Component <RouteComponentProps<IEventsProps>,IEventsState> {
  private EventsModel: TEventsModel | undefined;
  private events_date: string = '';
  private callback: IonChangeCallback | undefined;

  constructor({match} : RouteComponentProps<IEventsProps>) {
    super( {match} as RouteComponentProps<IEventsProps>);

    this.events_date = match.params.date;

    console.log('EventTablePage: ', this.events_date);
    this.state = {
      query: {
        FromIndex:0,
        QueriedQuantity: 10,
        SortMode: {
          DateTimeSortDirection: ISortDirection.Down,
          EventsSortMode:  IEventSortMode.All
        },
        Range:{...DefaultRange}
      },
      respond: {
        ClientID: '',
        DateTime: '',
        TotalItemsQuantity: 0,
        ItemsBefore: 0,
        ItemsAfter: 0,
        ItemsInRespond: 0,
        Items: []
      },
      showModal: false,
      filterEnable: false
    }

  }

  private async getEvents() {
    try {
      const events:TEventItems = await EventReader.getDateEvents(this.events_date);
      this.EventsModel = new TEventsModel(events);
      this.getData();
    } catch (e) {
      console.log(e)
    }
  }

  private onChangeDBatNow(props: any) {
    this.getEvents();
  }
  
  componentDidMount(){
    console.log(this.events_date);
    if (isNowDate(this.events_date)) {
      this.callback = this.onChangeDBatNow.bind(this);
      ModelDates.Subscribe = {func: this.callback, from:'event-table-page.tsx EventTablePage DidMount'};
    }    
    this.getEvents();
  }

  componentWillUnmount() {
    if (this.callback) {
      ModelDates.unSubscribe(this.callback, 'event-table-page.tsx EventTablePage willUnmount');
    };
  }

  private getData(){
    if (this.EventsModel) {
      const respond:IEventsRespond = this.EventsModel.getItems(this.state.query);
      this.setState({respond})
    }
  }

  private getNextIndex(direction: IQueryDirection): number {
    let nextIndex: number = this.state.query.FromIndex;
    switch (direction) {
      case IQueryDirection.Next:
        nextIndex  += this.state.query.QueriedQuantity;//ItemsOnPage;
        const max: number = (this.state.respond.TotalItemsQuantity === 0)
                            ? 0
                            : this.state.respond.TotalItemsQuantity - 1;
        nextIndex = (nextIndex > max)? max : nextIndex;
        break;
      case IQueryDirection.Prev:
        nextIndex  -= this.state.query.QueriedQuantity;//ItemsOnPage;
        nextIndex = (nextIndex < 0)? 0 : nextIndex;
        break;
    }
    return nextIndex;
  }

  private isNextPossible(direction: IQueryDirection): boolean {
    return !((direction === IQueryDirection.Next)
           && (this.state.respond.ItemsAfter === 0))
  }

  private readPortionOfItems(direction: IQueryDirection) {
    this.setState((state)=>({
      query:{
        ...state.query,
        FromIndex: this.getNextIndex(direction)
      }
    }), ()=>this.getData())
  }
  
  private getPortionOfItems(direction: IQueryDirection) {
    if (this.isNextPossible(direction)) {
      this.readPortionOfItems(direction)
    }
  }

  private setNumberOfItemsOnPage(QueriedQuantity: number){
    this.setState((state)=>({
      query:{
        ...state.query,
        QueriedQuantity
      }
    }), ()=>this.getData())
  }

  private tougleDateSortDirection(direction: ISortDirection): ISortDirection {
    return  (direction === ISortDirection.Up)
            ? ISortDirection.Down
            : ISortDirection.Up
  }

  private changeDateSortMode(): void {
    const query = {...this.state.query}
    const { DateTimeSortDirection }  =  {...query.SortMode};
    query.SortMode.DateTimeSortDirection = this.tougleDateSortDirection(DateTimeSortDirection);
    if (query !== undefined) {
      this.setState({query}, ()=>this.getData())
    }
  }

  private getDateSortDirectionIcon(direction: ISortDirection | undefined):string {
    const dir: ISortDirection = direction || ISortDirection.Up;
    return  (dir === ISortDirection.Up)
            ? '▲'
            : '▼'
  }

  private tougleEventsSortMode(mode: IEventSortMode): IEventSortMode {
    if (mode === IEventSortMode.All)     { return IEventSortMode.Alarm };
    if (mode === IEventSortMode.Alarm)   { return IEventSortMode.Warning };
    if (mode === IEventSortMode.Warning) { return IEventSortMode.Info };
    if (mode === IEventSortMode.Info)    { return IEventSortMode.All };
    return IEventSortMode.All;
  }

  private changeEventsSortMode() {
    const query = {...this.state.query}
    const { EventsSortMode }  =  {...query.SortMode};
    query.SortMode.EventsSortMode = this.tougleEventsSortMode(EventsSortMode);
    if (query !== undefined) {
      this.setState({query},(()=>{
        console.log(this.getEventSortModeIcon(query.SortMode.EventsSortMode));
        this.getData();
      }))
    }
  }

  private getEventSortModeIcon(Mode: IEventSortMode):string {
    const mode: IEventSortMode = Mode || IEventSortMode.All;
    if (mode === IEventSortMode.Alarm)   { return '⬥'};
    if (mode === IEventSortMode.Warning) { return '∎'};
    if (mode === IEventSortMode.Info)    { return '▲'};
    return '⋮' //All
  }

  private setRange(range: ISearchRangeQuery){
    const query = {...this.state.query}
    query.Range = range;
    this.setState({query},(()=>{
      this.getData();
    }))
  }

  private tougleFilter(enabled: boolean) {
    if (enabled) {
      this.setState({
        filterEnable: false
      })
      this.setRange(DefaultRange);
    } else {
      this.setState({showModal: true})
    }
  }

  private handlerToolMenu(name: string, status: boolean){
    const handlers: {[handlerName: string]: any} = {
      'Search' : this.tougleFilter.bind(this),
      'default'   : ()=>{console.log(`${name} not found`)}
    }
    return (handlers[name] || handlers['default'])(status)
  }

  private disableFilter(){
    this.setState({
      showModal:false,
      filterEnable: false
    })
    this.setRange(DefaultRange);
  }

  private enableFilter(range: ISearchRangeQuery) {
    const query = {...this.state.query}
    query.Range = {...query.Range, ...range};
    this.setRange(query.Range);
    this.setState({
      showModal: false,
      filterEnable: true
    })
  }

  private handlerFilterFormClose(range: ISearchRangeQuery | undefined) {
    (range)
    ? this.enableFilter(range)
    : this.disableFilter()
  }

  private getAvalibleTimeRangeInHHMMSS():Array<string> {
    return this.EventsModel?.AvalibleTimeRange || []
  }

  render() {
    const modal = this.state.showModal
    ? (
      <Modal classes='content-center'>
        <FilterSettings
          onExitHandler = {this.handlerFilterFormClose.bind(this)}
          Range = {this.state.query.Range || DefaultRange}
          AvalibleTimeRange = {this.getAvalibleTimeRangeInHHMMSS()}
          EventDate = {this.events_date}
        />
      </Modal>
    )
    : null;
    
    return (
      <>
        <div className='flex-column'>
          <EventsHeaderMenu
              ToolMenuHandler = {this.handlerToolMenu.bind(this)}
              isTougle = {this.state.filterEnable}
            />
          <div><b>{this.events_date}</b></div>
          <div className='flex-all-client b1pxdgr'>
            <EventsTable
              items = {this.state.respond.Items}
              DateSortDirectionIcon = {this.getDateSortDirectionIcon(this.state.query.SortMode?.DateTimeSortDirection)}
              EventsSortModeIcon = {this.getEventSortModeIcon(this.state.query.SortMode?.EventsSortMode)}
              changeDateSortModeHandler = {this.changeDateSortMode.bind(this)}
              changeEventsSortModeHandler = {this.changeEventsSortMode.bind(this)}
            />
          </div>
            <Paginator
              ItemsAfter = {this.state.respond.ItemsAfter}
              ItemsBefore = {this.state.respond.ItemsBefore}
              ItemsPortion = {TenItemsOnPage}
              QueriedQuantity = {this.state.query.QueriedQuantity}
              nextItemsHandler = {this.getPortionOfItems.bind(this)}
              setNumberOfItemsOnPageHandler = {this.setNumberOfItemsOnPage.bind(this)}
            />
          </div>
        {modal}
      </>
    );
  }
}

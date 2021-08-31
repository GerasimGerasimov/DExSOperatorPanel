import React, {Component} from "react";
import EventsHeaderMenu from "../header-menu/EventsHeaderMenu";
import '../Events.css'
import EventCard from "../event-card/event-card";
import { ModelDates } from "../../event-models/dates/dates-model";
import Paginator from "../../event-table/Pages/Events/components/paginator/paginator";
import { IDatesQuery, IDatesRespond, TDatesQuery } from "../../event-models/dates/dates-queries";
import { IQueryDirection, ISearchDateRangeQuery, ISortDirection } from "../../event-models/sort-conditions";

interface IDateCardsContainerProps {

}

interface IDateCardsContainerState {
  cards: Array<string>;
  tryCount: number,
  LoadError: string;
  isLoaded: boolean;
  query: IDatesQuery;
  respond: IDatesRespond;
  showModal: boolean;
  filterEnable: boolean;
}

const ItemsOnPage: number = 5;

const DefaultRange: ISearchDateRangeQuery = {
  dateFrom: undefined,
  dateTo:   undefined,
}

const DefaultQuery:IDatesQuery = {
  FromIndex: 0,
  QueriedQuantity: ItemsOnPage,
  SortMode: ISortDirection.Down,
  Range: {...DefaultRange}
}

export default class DateCardsContainer extends Component <IDateCardsContainerProps, IDateCardsContainerState> {
  private Model: TDatesQuery | undefined;
  
  constructor(props: IDateCardsContainerProps) {
    super(props);
    this.state = {
      cards:[],
      filterEnable: false,
      tryCount: 0,
      LoadError: '',
      isLoaded: false,
      showModal: false,
      query: {...DefaultQuery}, 
      respond: {
        TotalItemsQuantity: 0,
        ItemsBefore: 0,
        ItemsAfter: 0,
        ItemsInRespond: 0,
        SortMode: ISortDirection.Down,
        Items: []
      },
    }
  }

  private onDataAddedToDataBaseHandler(props: any) {
    console.log(`data-card-container.onChangeDBatNow: ${props}`);
    this.getData();
  }

  private onLoaded() {
    console.log('onLoaded');
    this.getData();
  }

  private onLoadError(arg:{count: number, error: string}) {
    console.log('onLoadError');
    this.setState ({
      tryCount: arg.count,
      LoadError: arg.error 
    })
  }

  componentDidMount() {
    //Результат борьбы с
    //Warning: Can't perform a React state update on an unmounted component. 
    this.Model = new TDatesQuery(ModelDates);
    ModelDates.dataLoadedCallBack = this.onLoaded.bind(this);
    this.Model.onDataAddedCallBack = this.onDataAddedToDataBaseHandler.bind(this);
    ModelDates.dataLoadErrorCallBack = this.onLoadError.bind(this);
    this.setState ({
        respond: {...this.Model.getItems(DefaultQuery)}
    })
    this.getData();
  }

  componentWillUnmount() {
    this.Model!.destructor();
  }

  private handlerToolMenu(name: string, status: boolean){
  }

  private isNextPossible(direction: IQueryDirection): boolean {
    return !((direction === IQueryDirection.Next)
           && (this.state.respond.ItemsAfter === 0))
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

  private getData(){
    if (this.Model) {
      const respond:IDatesRespond = this.Model.getItems(this.state.query);
      this.setState({
        respond,
        isLoaded: this.Model.isLoaded,
      })
    }
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

  render(){
    const items = this.state.respond.Items.map((item: string) => {
      return (
      <EventCard date={item} key={item} />)
    })
    
    const waitForLoad = () => {
      return (
        <div>
          <span className="spinner-border spinner-border-sm text-primary" role="status" aria-hidden="true"></span>
          {(this.state.LoadError === '')
           ? null
           : ( <div>
                <p>{`Try Count: ${this.state.tryCount}`}</p>
                <p>{`Error: ${this.state.LoadError}`}</p>
              </div>
           )
          }
        </div>
      )
    }

    return (
      <div className='flex-column'>
        <EventsHeaderMenu
            ToolMenuHandler = {this.handlerToolMenu.bind(this)}
            isTougle = {this.state.filterEnable}
          />
        <div className='flex-all-client'>
          <b>Event log</b>
          <div className="overflow-auto h-100 b1dg">
            {this.state.isLoaded
              ? <ul className="list-group">{items}</ul>
              : waitForLoad()
            }
          </div>
        </div>
        <Paginator
          ItemsAfter = {this.state.respond.ItemsAfter}
          ItemsBefore = {this.state.respond.ItemsBefore}
          ItemsPortion = {ItemsOnPage}
          QueriedQuantity = {this.state.query.QueriedQuantity}
          nextItemsHandler = {this.getPortionOfItems.bind(this)}
          setNumberOfItemsOnPageHandler = {this.setNumberOfItemsOnPage.bind(this)}
        />
      </div>
    )
  }
}

//<button onClick = {()=> this.getDates()}>Get Dates</button>
/**TODO
 * Виртуальный скролл больших таблиц на React
 * https://www.youtube.com/watch?v=D7EphjNEDI4
 * 
 * Динамическая пагинация на React JS. Подгрузка при скролле страницы React JS
 * https://www.youtube.com/watch?v=J2MWOhV8T6o
 * 
 * исп. готовые компоненты:
 * React.JS: создание огромных списков
 * https://www.youtube.com/watch?v=wIOygRAoAdA
 */
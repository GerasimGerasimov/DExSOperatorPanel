import React, { Component } from "react";
import { TEventDefaultDetails, TEventItem } from "../../../event-models/events";
import Markers from "../markers/event-icon";

import './EventsTable.css'

interface IEventTableProps {
  items: Array<TEventItem>;
  DateSortDirectionIcon: string;
  EventsSortModeIcon: string;
  changeDateSortModeHandler(): void;
  changeEventsSortModeHandler(): void;
}

interface IEventsTableState {

}

export default class EventsTable extends Component<IEventTableProps ,IEventsTableState> {

  private items: Array<TEventItem> = [];

  private getFormatedDateTime(datetime: string): string {
    const time = new Date(datetime).toLocaleTimeString();
    return time;
  }

  private parseDetails(details: string): TEventDefaultDetails {
    let res = new TEventDefaultDetails();
    try {
      res =  JSON.parse(details)
    } catch (e) {

    } 
    return res;
  }


  componentDidMount() {
    console.log('EventsTable DidMount')
  }

  componentDidUpdate() {
    this.items = [...this.props.items];
  }

  private isNew(value: number): boolean {
    return this.items.every((item)=>item.utime !== value)
  }

  private setClasses(value: number): string {
    let res = "";
    res += this.isNew(value) ? "event-table-new" : "";
    console.log(res);
    return res;
  }

  render () {
    return (
      <div className='events-wrapper'>
        <table className='events'>
          <thead>
            <tr>
                <th
                  onClick={()=>this.props.changeDateSortModeHandler()}>
                  Time {this.props.DateSortDirectionIcon}
                </th>
                <th>AW</th>
                <th
                  onClick={()=>this.props.changeEventsSortModeHandler()}>
                  Comment {this.props.EventsSortModeIcon}
                </th>
                <th>Tag</th>
            </tr>
            </thead>
            <tbody>
              {
                this.props.items.map((item, index)=>{
                  const {tag, date, details, type, utime} = {...item};
                  const {comment} = {...this.parseDetails(details)}//{initialValue, comment, todo}
                  const classes = this.setClasses(utime);
                  return (
                    <tr key={utime} className={classes}>
                      <td align="left">{this.getFormatedDateTime(date)}</td>
                      <td className='center '><Markers type={type}/></td>
                      <td align="left">{comment}</td>
                      <td align="left">{tag}</td>
                    </tr>
                  )
                })
              }
            </tbody>
        </table>
      </div>
    )
  }
}
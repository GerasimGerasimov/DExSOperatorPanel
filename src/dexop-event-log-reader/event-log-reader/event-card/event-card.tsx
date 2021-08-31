import React, {Component} from 'react';
import { EventReader } from '../controller/event-reader';
import { TEventItems } from '../../event-models/events';
import { sortMapKeyByOrder } from './event-card-helpers';
import { EEventTypes } from './event-card-types';
import { EventsCounter } from './event-counters';
import {NavLink} from 'react-router-dom';
import { IonChangeCallback, ModelDates } from '../../event-models/dates/dates-model';
import { isNowDate } from '../../event-table/helpers/timeutils';

interface IEventCardProps {
  date: string;
}

interface IEventCardState {
  events: Map<string, number>;
  isLoaded: boolean;
}

export default class EventCard extends Component<IEventCardProps, IEventCardState> {

  private count: number = 0;
  private callback: IonChangeCallback | undefined;

  constructor(props: IEventCardProps) {
    super(props)
    this.state = {
      events: new Map([['alarm', 0], ['warning', 0], ['info', 0]]),
      isLoaded: false
    };
  }

  private getEventTypesCount(events: TEventItems): Map<string, number>{
    let tmp: Map<string, number> = new Map();
    events.forEach( item => {
      if (tmp.has(item.type)) {
        let cnt: number = tmp.get(item.type) || 0;
        tmp.set(item.type, ++cnt)
      } else {
        tmp.set(item.type, 1)
      }
    });
    const c = Object.values(EEventTypes)// [EEventTypes.ALARM, EEventTypes.WARNING, EEventTypes.INFO]);
    return sortMapKeyByOrder(tmp, c)
  }

  private async getEvents() {
    try {
      const events:TEventItems = await EventReader.getDateEvents(this.props.date);
      this.setState({
        events: this.getEventTypesCount(events),
        isLoaded: true
      })
    } catch (e) {
      this.setState({events:new Map()})
      console.log(e)
    }
    console.log(this.count++)
  }

  private onChangeDBatNow(props: any) {
    this.getEvents();
  }

  componentDidMount() {
    console.log(this.props.date);
    if (isNowDate(this.props.date)) {
      this.callback = this.onChangeDBatNow.bind(this);
      ModelDates.Subscribe = {func: this.callback, from:'event-card EventCard DidMount'};
    }
    this.getEvents();
  }

  componentDidUpdate(){
  }

  componentWillUnmount() {
    if (this.callback) {
      ModelDates.unSubscribe(this.callback, 'EventCard event-card.tsx willUnmount');
    };
  }

  render() {
    const url = `/events/${this.props.date}`;
    return (
      <NavLink
        to={{
          pathname: url,
          state: {
            events: this.state.events
          }
        }}
      >
        <li className = "list-group-item list-group-item-action d-flex justify-content-between align-items-center m-1 shadow-sm">
          {this.props.date}
          {this.state.isLoaded
            ? <EventsCounter events = {this.state.events} />
            : <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
          }
        </li>
      </NavLink>
    )
  }
}

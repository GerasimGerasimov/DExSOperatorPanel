import React, {Component} from 'react'
import { EEventTypes } from './event-card-types';
import EventCounter from './event-counter';


interface IEventsCountersProps {
  events: Map<string, number>;
}

interface IEventsCountersState {

}

export class EventsCounter extends Component<IEventsCountersProps, IEventsCountersState> {
  
  constructor (props: IEventsCountersProps) {
    super(props)
  }

  private getIconStyle(event_type: string): {color: string, icon: string} {
    const icons: {[index: string]: any} = {
      [EEventTypes.ALARM]: {color:'red', icon:'⬥'},
      [EEventTypes.WARNING]: {color:'#ffba00', icon:'∎'},
      [EEventTypes.INFO]: {color:'#8000C0', icon:'▲'},
      'default': ()=>{
        console.log(`${event_type} not found`);
        return {color:'gray', icon:'?'};
      }
    }
    return (icons[event_type] || icons['default'])
  }

  private getIconElement(event_type: string): JSX.Element {
    const {color, icon} = {...this.getIconStyle(event_type)}
    return (
      <span className="font-weight-bold h6" style={{ color }}>{icon}</span>
    )
  }
  
  render () {
    const items = Array.from(this.props.events).map((item) => {
      return (
        <EventCounter icon = {this.getIconElement(item[0])} value = {item[1]} key = {`${item[0]}-${item[1]}`}/>
      )
    })

    return (
      <div>
        {items}
      </div>
    )
  }
}

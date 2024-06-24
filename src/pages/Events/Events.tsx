import React, { Component } from "react";

interface IEventsProps {

}

interface IEventsState {

}

export default class Events extends Component <IEventsProps, IEventsState> {
  // eslint-disable-next-line @typescript-eslint/no-useless-constructor
  constructor (props: IEventsProps) {
    super(props);
  }

  render () {
    return (
      <div>
        <h1>Events</h1>
      </div>
    )
  }
}
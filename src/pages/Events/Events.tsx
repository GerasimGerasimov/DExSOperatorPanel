import React, { Component } from "react";

interface IEventsProps {

}

interface IEventsState {

}

export default class Events extends Component <IEventsProps, IEventsState> {
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
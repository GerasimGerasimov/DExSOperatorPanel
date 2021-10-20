import React, { Component } from "react";
import { getEventIconsByType } from "./event-icons-lib";
import './event-icon.css';

export interface IMarkersProps {
  type: string;
}
/* https://ruseller.com/lessons.php?id=2077&rub=2 */

export default class Markers extends Component <IMarkersProps,{}> {

  render () {
    return (
      <div className='div-item'>
        <div className='legend-item'>
          {getEventIconsByType(this.props.type)}
        </div>
      </div>
    )
  }
}

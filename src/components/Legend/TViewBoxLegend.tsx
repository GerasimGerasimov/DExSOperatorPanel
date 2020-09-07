import React, {Component} from 'react'
import './Legend.css'
import { ColorMark } from './ColorMark/colormark';

export interface IViewBoxLegendProps {
}

interface IViewBoxLegendState {
}

export default class TViewBoxLegend extends Component<IViewBoxLegendProps, IViewBoxLegendState> {
    constructor (props: IViewBoxLegendProps){
      super(props);
    }

    render() {
      return (
        <div className='legend'>
              <div className='legend__item flex_row'>
                <ColorMark color={'green'}/>
                <span >U2/Iexc:</span>
                <span >100.5 А</span>
              </div>
              <div className='legend__item flex_row'>
                <ColorMark color={'gray'}/>
                <span >U2/Ustat:</span>
                <span >6300 А</span>
              </div>
        </div>
      )
    }
}

//TODO сделать легенду к графику
import React, {Component} from 'react'
import './Legend.css'

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
              <div className='legend__item'>U1/Iexc</div>
              <div className='legend__item'>U2/Ustat</div>
        </div>
      )
    }
}

//TODO сделать легенду к графику
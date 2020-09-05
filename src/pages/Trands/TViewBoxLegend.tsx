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
        <div className='Legend'>
            <ul className='Legend wrapper'>
              <i className='Legend element'>1111</i>
              <i className='Legend element'>2222</i>
            </ul>
        </div>
      )
    }
}

//TODO сделать легенду к графику
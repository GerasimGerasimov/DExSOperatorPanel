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
            <div className='Legend wrapper'>
              <div className='Legend element'>1111</div>
              <div className='Legend element'>2222</div>
            </div>
        </div>
      )
    }
}

//TODO сделать легенду к графику
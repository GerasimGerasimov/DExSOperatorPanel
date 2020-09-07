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
          <table>
            <tr>
              <td><ColorMark color={'green'}/></td>
              <td>U2/Iexc</td>
              <td>100.5</td>
              <td>А</td>
            </tr>
            <tr>
              <td><ColorMark color={'gray'}/></td>
              <td>U2/Ustat</td>
              <td>11340</td>
              <td>B</td>
            </tr>
          </table>

        </div>
      )
    }
}

//TODO сделать легенду к графику
/*
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
*/
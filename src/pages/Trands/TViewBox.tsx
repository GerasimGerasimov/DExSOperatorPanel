import React, {Component} from 'react'
import './Trands.css'
import { TTrandHeight } from '../../lib/trands/trandsgroup'
import TViewBoxModel from './TViewBoxModel';

export interface IViewBoxProps {
  height: TTrandHeight;
  viewBox: TViewBoxModel;
}

export default class TViewBox extends Component<IViewBoxProps, {}> {
    private height: TTrandHeight;

    constructor (props: any){
      super(props);
      this.height = this.props.height;
    }

    render() {
      const {height, mu} = {...this.height}
      return (
        <div
          className='Trands box'
          style={{
            height: `${height}${mu}`
          }}>
            <h3>TViewBox</h3>
        </div>
      )
    }
}
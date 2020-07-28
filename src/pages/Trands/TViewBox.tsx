import React, {Component} from 'react'
import './Trands.css'
import { TTrandHeight } from '../../lib/trands/trandsgroup'

export interface IViewBoxProps {
  height: TTrandHeight;
}

export default class TViewBox extends Component<IViewBoxProps, {}> {
    
    constructor (props: any){
        super(props)
    }

    render() {
      const {height, mu} = {...this.props.height}
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
import React, {Component} from 'react'
import { Trands } from '../../lib/trands/trands'
import './Trands.css'
import TViewBox from './TViewBox'

export default class TrandsPage extends Component {
    
    constructor (props: any){
        super(props)
    }

    private getTrandsBoxes(): any{
      return Trands.getBoxesHeight().map((value, index)=>{
        return (
            <TViewBox
              key={index}
              height = {value}
            />
        )
      })
    }

    render() {

        return(
          <>
            <h1>Trands page</h1>
            <div className='Trands wrapper'>
              {this.getTrandsBoxes()}
            </div>
          </>
        )
      }
}
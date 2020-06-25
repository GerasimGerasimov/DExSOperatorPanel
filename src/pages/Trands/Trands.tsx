import React, {Component} from 'react'
import { Trands } from '../../lib/trands/trands'
import './Trands.css'

export default class TrandsPage extends Component {
    
    constructor (props: any){
        super(props)
    }

    private getTrandsBoxes(): any{
      return Trands.getBoxesHeight().map((value, index)=>{
        const {height, mu} = {...value}
        return (
          <div
            key={index}
            className='Trands box'
            style={{
              height: `${height}${mu}`
            }}>
          </div>
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
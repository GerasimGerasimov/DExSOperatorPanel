import React, {Component} from 'react'
import { Trands } from '../../lib/trands/trands'
import './Trands.css'
import TViewBox from './TViewBox'

export default class TrandsPage extends Component {
    
    constructor (props: any){
        super(props)
    }

    private changeScrollPosition(e: any) {
      console.log(e.target.value)
    }

    private getTrandsBoxes(): any{
      return Trands.getBoxes().map((box, index)=>{
        return (
            <TViewBox
              key={index}
              height = {box.Height}
              viewBox = {box}
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
            <input type="range"
              className = 'Trands range'
              min="0"
              max="600"
              step="1"
              onChange={(e)=>this.changeScrollPosition(e)}/>
          </>
        )
      }
}
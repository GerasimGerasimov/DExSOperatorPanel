import React, {Component} from 'react'
import { Trands } from '../../lib/trands/trands'
import './Trands.css'
import TViewBox from './TViewBox'
import { ITrandProp } from '../../lib/trands/itrand'

interface ITrandsPageState {
  scrollPosition: number;
  deep: number;
}

export default class TrandsPage extends Component<{}, ITrandsPageState> {
    
    constructor (props: any){
        super(props);
        this.state = {
          scrollPosition: 0,
          deep: Trands.Deep
        }
    }

    private changeScrollPosition(e: any) {
      //console.log(e.target.value)
      this.setState({scrollPosition: e.target.value});
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
            <h1>Trands page {this.state.scrollPosition}</h1>
            <div className='Trands wrapper'>
              {this.getTrandsBoxes()}
            </div>
            <input type="range"
              className = 'Trands range'
              value={this.state.scrollPosition}
              min="0"
              max={this.state.deep}
              step="1"
              onInput={(e)=>this.changeScrollPosition(e)}/>
          </>
        )
      }
}
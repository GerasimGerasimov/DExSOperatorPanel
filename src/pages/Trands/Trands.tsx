import React, {Component} from 'react'
import { Trands } from '../../lib/trands/trands'
import './Trands.css'
import TViewBox from './TViewBox'

interface ITrandsPageState {
  scrollPosition: number;
  deep: number;
  changeCount: number;
}

export default class TrandsPage extends Component<{}, ITrandsPageState> {
    
    private UpdateID: string = '';

    constructor (props: any){
        super(props);
        this.state = {
          scrollPosition: 0,
          deep: Trands.Deep,
          changeCount: 0
        }
        this.UpdateID = Trands.setOnUpdate(this.onDataUpdate.bind(this));
    }

    public componentWillUnmount(){
      Trands.deleteOnUpdateByID(this.UpdateID);
    }

    private onDataUpdate(){
      this.setState(state=> ({
        changeCount: state.changeCount + 1
      }))
    }

    private changeScrollPosition(e: any) {
      this.setState({scrollPosition: e.target.value});
    }

    private getTrandsBoxes(scrollPosition: number): any{
      return Trands.getBoxes().map((box, index)=>{
        return (
            <TViewBox
              key={index}
              height = {box.Height}
              viewBox = {box}
              scrollPosition = {scrollPosition}
            />
        )
      })
    }

    render() {

        return(
          <>
            <h1>Trands page</h1>
            <div className='Trands wrapper'>
              {this.getTrandsBoxes(this.state.scrollPosition)}
            </div>
            <input type="range"
              className = 'Trands range'
              value={this.state.scrollPosition}
              min="0"
              max={this.state.deep}
              step="1"
              onChange={(e)=>this.changeScrollPosition(e)}/>
          </>
        )
      }
}
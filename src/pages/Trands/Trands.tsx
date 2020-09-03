import React, {Component} from 'react'
import { Trands } from '../../lib/trands/trands'
import './Trands.css'
import TViewBox from './TViewBox'
import TrandsMenu, { IToolButton } from '../../components/TrandsMenu/TrandsMenu';

interface ITrandsPageState {
  scrollPosition: number;
  deep: number;
}

export default class TrandsPage extends Component<{}, ITrandsPageState> {
    private ToolButtons: Array<IToolButton> = [
      { type:'Button', icon:['fa-network-wired'], onClick:this.handlerPausePlay},
      { type:'Button', icon:['fa-database'],      onClick:this.handlerPausePlay},
      { type:'TougleButton', icon:['fa-play-circle','fa-pause-circle'], isTougle:false,
        onClick:this.handlerPausePlay},
      { type:'Button', icon:['fa-search-minus'],  onClick:this.handlerPausePlay},
      { type:'Button', icon:['fa-search-plus'],   onClick:this.handlerPausePlay},
      { type:'Button', icon:['fa-ruler-combined'],onClick:this.handlerPausePlay},
    ]
    constructor (props: any){
        super(props);
        this.state = {
          scrollPosition: 0,
          deep: Trands.Deep
        }
    }

    private handlerPausePlay(e: any, tougle: boolean){
      console.log('press', tougle)
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
          <div>
            <TrandsMenu buttons = {this.ToolButtons}/>
            <div className='Trands wrapper'>
              {this.getTrandsBoxes(this.state.scrollPosition)}
              <input type="range"
                className = 'Trands range'
                value={this.state.scrollPosition}
                min="0"
                max={this.state.deep}
                step="1"
                onChange={(e)=>this.changeScrollPosition(e)}/>
            </div>
          </div>
        )
      }
}
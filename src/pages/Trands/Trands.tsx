import React, {Component} from 'react'
import { Trands } from '../../lib/trands/trands'
import './Trands.css'
import TViewBox from './TViewBox'
import ToolMenu from '../../components/TrandsMenu/ToolMenu';
import { IToolButtonProps } from '../../components/TrandsMenu/buttons/iToolButton';

interface ITrandsPageState {
  scrollPosition: number;
  deep: number;
  widthScale: number;
}

export default class TrandsPage extends Component<{}, ITrandsPageState> {
    private ToolMenu: Array<IToolButtonProps> = [
      { name: 'onLine', type:'ToolButton', icon:['fa-network-wired'], onClick:this.handlerToolMenu.bind(this)},
      { name: 'DB', type:'ToolButton', icon:['fa-database'],      onClick:this.handlerToolMenu.bind(this)},
      { name: 'PlayPause', type:'TougleButton', icon:['fa-play-circle','fa-pause-circle'], isTougle:false,
        onClick:this.handlerToolMenu.bind(this)},
      { name: 'ZoomMinus', type:'ToolButton', icon:['fa-search-minus'],  onClick:this.handlerToolMenu.bind(this)},
      { name: 'ZoomPlus', type:'ToolButton', icon:['fa-search-plus'],   onClick:this.handlerToolMenu.bind(this)},
      { name: 'Amplitude', type:'ToolButton', icon:['fa-ruler-combined'],onClick:this.handlerToolMenu.bind(this)},
    ]
    constructor (props: any){
        super(props);
        this.state = {
          scrollPosition: 0,
          deep: Trands.Deep,
          widthScale: Trands.WidthScale
        }
    }

    private onZoomMinus(status: boolean){
      let widthScale = Number((this.state.widthScale + 0.1).toFixed(1));
      this.setState({widthScale: ((widthScale > 4)? 4: widthScale)})
      console.log(this.state.widthScale);
    }

    private onZoomPlus(status:boolean){
      let widthScale = Number((this.state.widthScale - 0.1).toFixed(1));
      this.setState({widthScale: ((widthScale < 0.2)? 0.2: widthScale)})
      console.log(this.state.widthScale);
    }

    private onPlayPause(status: boolean) {
      console.log((status)?'play':'pause');
    }

    private handlerToolMenu(name: string, status: boolean){
      const handlers: {[handlerName: string]: any} = {
        'ZoomMinus' : this.onZoomMinus.bind(this),
        'ZoomPlus'  : this.onZoomPlus.bind(this),
        'PlayPause' : this.onPlayPause,
        'default'   : ()=>{console.log(`${name} not found`)}
      }
      return (handlers[name] || handlers['default'])(status)
    }

    private changeScrollPosition(e: any) {
      this.setState({scrollPosition: e.target.value});
    }

    private getTrandsBoxes(scrollPosition: number): any{
      return Trands.getBoxes().map((box, index)=>{
        return (
            <TViewBox
              key={index}
              widthScale={this.state.widthScale}
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
            <ToolMenu elements = {this.ToolMenu}/>
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
import React, {Component} from 'react'
import { Trands } from '../../lib/trands/trands'
import './Trands.css'
import TViewBox, { IViewBoxSelectedPosition } from './TViewBox'
import ToolMenu from '../../components/TrandsMenu/ToolMenu';
import { IToolButtonProps } from '../../components/TrandsMenu/buttons/iToolButton';
import { ISelected } from './TDrawCanvas';

interface ITrandsPageState {
  scrollPosition: number;
  deep: number;
  widthScale: number;
  SelectedIndex: ISelected;
}

export default class TrandsPage extends Component<{}, ITrandsPageState> {
    private ToolMenu: Array<IToolButtonProps> = [
      { name: 'onLine', type:'ToolButton', icon:['fa-network-wired'], onClick:this.handlerToolMenu.bind(this)},
      { name: 'DB', type:'ToolButton', icon:['fa-database'],      onClick:this.handlerToolMenu.bind(this)},
      { name: 'PlayPause', type:'TougleButton', icon:['fa-pause-circle','fa-play-circle'], isTougle: Trands.Run,
        onClick:this.handlerToolMenu.bind(this)},
      { name: 'ZoomMinus', type:'ToolButton', icon:['fa-search-minus'],  onClick:this.handlerToolMenu.bind(this)},
      { name: 'ZoomPlus', type:'ToolButton', icon:['fa-search-plus'],   onClick:this.handlerToolMenu.bind(this)},
      { name: 'Amplitude', type:'TougleButton', icon:['fa-ruler-combined', 'fa-ruler-combined'],onClick:this.handlerToolMenu.bind(this)},
    ]
    constructor (props: any){
        super(props);
        this.state = {
          scrollPosition: 0,
          deep: Trands.Deep,
          widthScale: Trands.WidthScale,
          SelectedIndex: {
            Index: 0,
            Left: 0
          }
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
      Trands.Run = !status;
    }

    private onAmplitude(status: boolean) {
      console.log((!status)?'Measure Amplitude':'Not Measure Amplitude');
    }

    private handlerToolMenu(name: string, status: boolean){
      const handlers: {[handlerName: string]: any} = {
        'ZoomMinus' : this.onZoomMinus.bind(this),
        'ZoomPlus'  : this.onZoomPlus.bind(this),
        'PlayPause' : this.onPlayPause.bind(this),
        'Amplitude' : this.onAmplitude.bind(this),
        'default'   : ()=>{console.log(`${name} not found`)}
      }
      return (handlers[name] || handlers['default'])(status)
    }

    private changeScrollPosition(e: any) {
      this.setState({scrollPosition: e.target.value});
    }

    private onViewBoxClickHandler( position: IViewBoxSelectedPosition): void {
      this.setState({SelectedIndex:{
        Index: position.position,
        Left: position.left
      }})
    }

    private getTrandsBoxes(): any{
      return Trands.getBoxes().map((box, index)=>{
        box.ScrollPosition = this.state.scrollPosition;
        box.WidthScale     = this.state.widthScale;
        return (
            <TViewBox
              key = {index}
              viewBox = {box}
              onSetSelectedIndex = {this.onViewBoxClickHandler.bind(this)}
              Selected = {this.state.SelectedIndex}
            />
        )
      })
    }

    render() {
        return(
          <div>
            <ToolMenu elements = {this.ToolMenu}/>
            <div className='Trands wrapper'>
              {this.getTrandsBoxes()}
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

/*TODO сделать "палку" измерения амплитуды
 1) палку надо показывать одновременно во всех TViewBox (из может быть >1)
 2) амплитуту надо показать во всех TViewBox
*/
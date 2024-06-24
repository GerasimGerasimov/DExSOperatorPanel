import React, { Component } from 'react';
import { Trands } from '../../lib/trands/trands';
import './Trands.css';
import TViewBox from './TViewBox';
import TrandsHeaderMenu from './TrandsHeaderMenu';
import { ISelected } from '../../interfaces/ISelected';

interface ITrandsPageState {
  scrollPosition: number;
  deep: number;
  widthScale: number;
  SelectedIndex: ISelected;
  isMeasure: boolean;
}

export default class TrandsPage extends Component<{}, ITrandsPageState> {
    constructor (props: any) {
        super(props);
        this.state = {
          scrollPosition: 0,
          deep: Trands.Deep,
          widthScale: Trands.WidthScale,
          SelectedIndex: {
            Index: 0,
            Left: 0
          },
          isMeasure: false
        }
    }

    private onZoomMinus (status: boolean) {
      const widthScale = Number((this.state.widthScale + 0.1).toFixed(1));
      this.setState({ widthScale: ((widthScale > 4) ? 4 : widthScale) });
      console.log(this.state.widthScale);
    }

    private onZoomPlus (status:boolean) {
      const widthScale = Number((this.state.widthScale - 0.1).toFixed(1));
      this.setState({ widthScale: ((widthScale < 0.2) ? 0.2 : widthScale) });
      console.log(this.state.widthScale);
    }

    private onPlayPause (status: boolean) {
      Trands.Run = !status;
      this.setState({ isMeasure: status })
    }

    private handlerToolMenu (name: string, status: boolean) {
      const handlers: {[handlerName: string]: any} = {
        'ZoomMinus': this.onZoomMinus.bind(this),
        'ZoomPlus': this.onZoomPlus.bind(this),
        'PlayPause': this.onPlayPause.bind(this),
        'default': () => { console.log(`${name} not found`) }
      }
      return (handlers[name] || handlers['default'])(status)
    }

    private changeScrollPosition (e: any) {
      this.setState({ scrollPosition: e.target.value });
    }

    private onViewBoxClickHandler (position: ISelected): void {
      this.setState({
        SelectedIndex: {
          Index: position.Index,
          Left: position.Left
        }
      })
    }

    private getTrandsBoxes (): any {
      return Trands.getBoxes().map((box, index) => {
        box.ScrollPosition = this.state.scrollPosition;
        box.WidthScale = this.state.widthScale;
        return (
            <TViewBox
              key = {index}
              viewBox = {box}
              onSetSelectedIndex = {this.onViewBoxClickHandler.bind(this)}
              Selected = {this.state.SelectedIndex}
              isMeasure = {this.state.isMeasure}
            />
        )
      })
    }

    render () {
        return (
          <div className='Trands_flex'>
            <TrandsHeaderMenu
              ToolMenuHandler = {this.handlerToolMenu.bind(this)}
              isTougle = {Trands.Run}
            />
            <div className='Trands wrapper'>
              {this.getTrandsBoxes()}
            </div>
              <input type="range"
                className = 'Trands range'
                value={this.state.scrollPosition}
                min="0"
                max={this.state.deep}
                step="1"
                onChange={(e) => this.changeScrollPosition(e)}/>
          </div>
        )
      }
}

/* TODO в режиме измерения, при клике, вверху меню, показывает дату-время
     в месте пересечения курсора и значений
     Добавить TTimeMark в модель данных для хранения даты-времени
     появления записей в массиве моделей.
*/

/* TODO в режиме измерения, при прокрутке, легенда автоматически пересчитывается
      Left остаётся неизменным, но scrollPosition меняется
      , а от него завист StartPosition модели данных
*/

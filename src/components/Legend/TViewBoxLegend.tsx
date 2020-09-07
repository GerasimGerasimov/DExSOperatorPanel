import React, {Component} from 'react'
import './Legend.css'
import { ColorMark } from './ColorMark/colormark';

export interface ILegendItem {
  color: string;
  tag: string;
  value: string;
  msu: string
}

export interface IViewBoxLegendProps {
  Items: Array<ILegendItem>;
}

interface IViewBoxLegendState {
}

export default class TViewBoxLegend extends Component<IViewBoxLegendProps, IViewBoxLegendState> {
    private Items: Array<ILegendItem>;
    constructor (props: IViewBoxLegendProps){
      super(props);
      this.Items = props.Items;
    }

    render() {
      return (
        <div className='legend'>
          <table>
           {
            this.Items.map((item, index) => {
              const  {color, tag, value, msu} = item
                return (
                  <tr key={index}>
                    <td><ColorMark color={color}/></td>
                    <td>{tag}</td>
                    <td >{value}</td>
                    <td >{msu}</td>
                  </tr>
                  )}
                )
            }
          </table>
        </div>
      )
    }
}

//TODO сделать легенду к графику
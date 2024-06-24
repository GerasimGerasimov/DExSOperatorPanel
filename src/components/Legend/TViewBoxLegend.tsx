import React, { Component } from 'react'
import './Legend.css';
import { ColorMark } from './ColorMark/ColorMark';
import { IViewBoxLegendProps } from '../../interfaces/IViewBoxLegendProps';
import { ILegendItem } from '../../interfaces/ILegendItem';

interface IViewBoxLegendState {
}

export default class TViewBoxLegend extends Component<IViewBoxLegendProps, IViewBoxLegendState> {
    private itemArray: Array<ILegendItem>;
    constructor (props: IViewBoxLegendProps) {
      super(props);
      this.itemArray = props.Items;
    };

    render () {
      return (
        <div className='legend'>
          <table>
            <tbody>
            {
              this.itemArray.map((item, index) => {
                const { color, tag, value, msu } = item
                  return (
                    <tr key={index}>
                      <td>
                        <ColorMark color={color}/>
                      </td>
                      <td>{tag}</td>
                      <td align="left">{value}</td>
                      <td>{msu}</td>
                    </tr>
                  )
                }
              )
            }
            </tbody>
          </table>
        </div>
      )
    }
}

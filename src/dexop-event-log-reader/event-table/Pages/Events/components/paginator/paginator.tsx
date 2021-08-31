import React, { Component } from "react";
import { IQueryDirection } from "../../../../../event-models/sort-conditions";

import './paginator.css'

interface IPaginatorProps {
  ItemsBefore: number;
  ItemsAfter: number;
  ItemsPortion: number;
  QueriedQuantity: number;
  nextItemsHandler: any;
  setNumberOfItemsOnPageHandler: any;
}

interface IPaginatorState {
  addDisabled: boolean;
  subDisabled: boolean;
}

const minItemsOnPage: number = 10;
const maxItemsOnPage: number = 40;

export default class Paginator extends Component <IPaginatorProps,IPaginatorState> {

  constructor (props: IPaginatorProps) {
    super(props);
    this.state = {
      addDisabled: false,
      subDisabled: true
    }
  }

  private addItemsOnPage(quantity: number): number {
    const remainingItems: number = this.props.QueriedQuantity + quantity;
    return (():number => {
      const result =  (remainingItems > maxItemsOnPage)
      ? maxItemsOnPage
      : remainingItems;
      this.setState({
        addDisabled:(result === maxItemsOnPage),
        subDisabled: false})
      return result;
    })();
  }

  private subItemsOnPage(quantity: number): number {
    const remainingItems: number = this.props.QueriedQuantity - quantity;
    return (():number => {
      const result = (remainingItems < minItemsOnPage)
      ? minItemsOnPage
      : remainingItems;
      this.setState({
        subDisabled:(result === minItemsOnPage),
        addDisabled: false
      })
      return result;
    })();
  }

  private isDisabled(value: number):boolean {
    return  (value === 0)
  }

  render () {
    return (
      <div className='flex alitcn jcsa'>
        <span>{this.props.ItemsBefore}</span>
        <button
          className="btn btn-primary btn-xs"
          disabled={this.isDisabled(this.props.ItemsBefore)}
          onClick={()=>this.props.nextItemsHandler(IQueryDirection.Prev)}>Pred</button>
        <button
          className="btn btn-primary btn-xs"
          disabled={this.isDisabled(this.props.ItemsAfter)}
          onClick={()=>this.props.nextItemsHandler(IQueryDirection.Next)}>Next</button>
        <span>{this.props.ItemsAfter}</span>
        <button
          className="btn btn-secondary btn-xs"
          disabled={this.state.subDisabled}
          onClick={()=>this.props.setNumberOfItemsOnPageHandler(this.subItemsOnPage(this.props.ItemsPortion))}>-10</button>       
        <button
          className="btn btn-secondary btn-xs"
          disabled={this.state.addDisabled}
          onClick={()=>this.props.setNumberOfItemsOnPageHandler(this.addItemsOnPage(this.props.ItemsPortion))}>+10</button>
     </div>
    )
  }
}
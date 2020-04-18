import React, {Component} from 'react'
import {inject, observer} from 'mobx-react'
import {observable, autorun} from 'mobx'
import {deviceStore, TDeviceStore} from '../store/devices/devices'
import MotorSVG from '../img/vteg.svg'
import {TSVGGroups, TElementAndAttrValue, TSVGTemplateElement} from '../lib/svg/lib/svggroup'
import { changeSingleQuotesToDouble } from '../lib/svg/lib/utils'

/*
interface HomeProps {
  store?: TDeviceStore
}
@inject('stores')
*/
@observer
//export default class Home extends Component<HomeProps> {
export default class Home extends Component {
  @observable Ustat: string = '';
  @observable Iexc: string = '';
  private Elements: Array<TSVGTemplateElement> = [];

  constructor (props: any){
    super(props)
    autorun(()=>{this.putValuesToSVGTemplate(deviceStore.changeTime)})
  }

  private putValuesToSVGTemplate(changed: any){
    if (this.Elements) {
      this.Elements.forEach((item:TSVGTemplateElement) => {
        const value: string = this.getTagData(`U1>U1:RAM>data>${item.attr.value}`)
        item.element.innerHTML = value;
      })
    }
  }

  // U1>U1:RAM>data>Iexc
  private getTagData(tag: string) {
    const keyList: Array<string> = tag.split('>')
    var o: any = deviceStore.pureDeviceData;;
    var value: any;
    keyList.forEach((key:string)=>{
      value = key in o ? o[key] : undefined;
      if (!value) return '';
      o = value;
    })
    return value;
  }
 
  componentDidMount(){
    console.log('был рендер')
  }

  handleImageLoaded() {
    console.log('svg загружен')
    const g: TSVGGroups = new TSVGGroups('vteg');
    this.Elements = g.getElementsAndValuesByAttr('data-id')
      .map((item: TElementAndAttrValue):TSVGTemplateElement => {
        let result: TSVGTemplateElement = {
          element: item.element,
          attr: changeSingleQuotesToDouble(item.value)
        }
        return result
    });
  }

  render() {
    return(
      <>
        <h1>Home page class</h1>
        <button type="button" className="btn btn-primary ml-1">
          <span className="badge badge-light bg-success">
            Count:
          </span>
          <span className="badge badge-light bg-warning ml-1">
            {deviceStore.count}
          </span>
        </button>
        <br></br>
        <object className="mt-1" id="vteg" type="image/svg+xml"
            data={MotorSVG}
            onLoad={()=>{this.handleImageLoaded()}}
            > {/*width="100%" height="100%"*/}
        </object>	      
      </>
    )
  }
}

//TODO округление сверхмалых чисел типа вот такого 5.877471754111438e-39

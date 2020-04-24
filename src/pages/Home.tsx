import React, {Component} from 'react'
import {inject, observer} from 'mobx-react'
import {observable, autorun} from 'mobx'
import {deviceStore, TDeviceStore} from '../store/devices/devices'
import MotorSVG from  '../assets/svg/vteg.svg'
import {TSVGGroups, TElementAndAttrValue, TSVGTemplateElement, TElementAttrObject} from '../lib/svg/lib/svggroup'
import { changeSingleQuotesToDouble } from '../lib/svg/lib/utils'
import {TSvgContents} from '../lib/svg/lib/svgcontent'
import TSwitch from '../lib/svg/lib/components'

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
  private MainSwitch: TSwitch | undefined = undefined;
  private svgContents: TSvgContents = new TSvgContents();

  constructor (props: any){
    super(props)
    autorun(()=>{this.putValuesToSVGTemplate(deviceStore.changeTime)})
  }

  private putValuesToSVGTemplate(changed: any){
    if (this.Elements) {
      this.Elements.forEach((item:TSVGTemplateElement) => {
        if (item.attr.model === 'text') {
          const value: string = this.getTagData(`U1>U1:RAM>data>${item.attr.value}`)
          item.element.innerHTML = value;
        } else {
          if (item.attr.model === 'TSwitch') {
            console.log('TSwitch');
            if (this.MainSwitch) 
              this.MainSwitch.draw();
          }
        }
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
          attr: {...new TElementAttrObject(), ...changeSingleQuotesToDouble(item.value)}
        }
        return result
    });
    //загрузить SVG-шки выключателя
    this.svgContents.getImg('switchOn'   ,  '/assets/svg/switchOn.svg');
    this.svgContents.getImg('switchOff'  ,  '/assets/svg/switchOff.svg');
    this.svgContents.getImg('switchNoLink', '/assets/svg/switchNoLink.svg');

    const element: TSVGTemplateElement | undefined = 
      this.Elements.find((item: TSVGTemplateElement) => {
        if (item.attr.model === 'TSwitch')
          return item.element}
      );
    this.MainSwitch = new TSwitch(element?.element, this.svgContents);
  }

  render() {
    return(
      <>
        <h1>Home </h1>
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

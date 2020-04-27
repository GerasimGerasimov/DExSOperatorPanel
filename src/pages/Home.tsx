import React, {Component} from 'react'
import {inject, observer} from 'mobx-react'
import {observable, autorun} from 'mobx'
import {deviceStore, TDeviceStore} from '../store/devices/devices'
import MotorSVG from  '../assets/svg/vteg.svg'
import {TSVGGroups, TElementAndAttrValue, TSVGTemplateElement, TElementAttrObject} from '../lib/svg/lib/svggroup'
import { changeSingleQuotesToDouble } from '../lib/svg/lib/utils'
import {TSVGComponent, TSVGComponentArg} from '../lib/svg/lib/components/TSVGComponent'
import { createSVGComponent, TSVGComponentInitialArgs } from '../lib/svg/lib/components/svgCompFabrica'

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
  private svgComponents: Array<TSVGComponent> = [];
  private checkBoxMainSwitch: any = React.createRef();
  private checkBoxLinkAvail: any = React.createRef();
  @observable MainSwitch: boolean = true;
  @observable LinkAvail: boolean = true;

  constructor (props: any){
    super(props)
    autorun(()=>{this.putValuesToSVGTemplate(deviceStore.changeTime)})
  }

  private putValuesToSVGTemplate(changed: any){
    this.svgComponents.forEach((item: TSVGComponent) => {
      let value: TSVGComponentArg = {
          value:this.getTagData(`U1>U1:RAM>data>${item.Tag}`),
          valid: true
        }
      item.setState(value);
      item.draw();
    })
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
    const Elements = g.getElementsAndValuesByAttr('data-id')
      .map((item: TElementAndAttrValue):TSVGTemplateElement => {
        let result: TSVGTemplateElement = {
          element: item.element,
          attr: {...new TElementAttrObject(), ...changeSingleQuotesToDouble(item.tag)}
        }
        return result
    });
    //создать объекты
    Elements.forEach((item: TSVGTemplateElement) => {
      const arg: TSVGComponentInitialArgs = {
        element: item.element,
        tag: item.attr.tag
      }
      const o: TSVGComponent | undefined = createSVGComponent(item.attr.model, arg);
      if (o) this.svgComponents.push(o);
    });
  }

  handleMainSwitch(event: any) {
    this.MainSwitch = !this.MainSwitch
  }

  handleLinkAvail(event: any) {
    this.LinkAvail = !this.LinkAvail
  }

  render() {
    return(
      <>
        <input type="checkbox"
          checked = {this.MainSwitch}
          onClick={this.handleMainSwitch.bind(this)}
          ref = {this.checkBoxMainSwitch}/>
        <input type="checkbox"
          checked = {this.LinkAvail}
          onClick={this.handleLinkAvail.bind(this)}
          ref = {this.checkBoxLinkAvail}/>
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

import React, {Component} from 'react'
import {inject, observer} from 'mobx-react'
import {observable, autorun} from 'mobx'
import {deviceStore, TDeviceStore} from '../store/devices/devices'
import MotorSVG from '../img/vteg.svg'

interface HomeProps {
  store?: TDeviceStore
}
@inject('stores')

@observer
export default class Home extends Component<HomeProps> {
  @observable Ustat: string = ''
  @observable Iexc: string = ''

  constructor (props: any){
    super(props)
    autorun(()=>{this.reportchangeTime(deviceStore.changeTime)})
  }

  private reportchangeTime(i: any){
    this.Ustat = this.getTagData('U1>U1:RAM>data>Ustat')
    this.Iexc = this.getTagData('U1>U1:RAM>data>Iexc')
  }

  // U1>U1:RAM>data>Iexc
  private getTagData(tag: string) {
    const keyList: Array<string> = tag.split('>')
    var o: any = deviceStore.pureDeviceData;;
    var value: any;
    keyList.forEach((key:string)=>{
      value = key in o ? o[key] : undefined;
      if (!value) return undefined;
      o = value;
    })
    return value;
  }
 
  componentDidMount(){
    let id = 'vteg';
    var s = document.getElementById(id);//получаю доступ к DOM SVG
    //console.log(s.data);
    //var gs = s.contentDocument.children[0].getElementsByTagName('*');//найду все элементы g
    console.log('был рендер')
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
        <button type="button" className="btn btn-primary ml-1">
          <span className="badge badge-light bg-success">
            Ustat:
          </span>
          <span className="badge badge-light bg-warning ml-1">
              {this.Ustat}
          </span>
        </button>
        <button type="button" className="btn btn-primary ml-1">
          <span className="badge badge-light bg-success">
            Iexc:
          </span>
          <span className="badge badge-light bg-warning ml-1">
              {this.Iexc}
          </span>
        </button>
        <br></br>
        <object className="mt-1" id="vteg" type="image/svg+xml"
            data={MotorSVG}  > {/*width="100%" height="100%"*/}
        </object>	      
      </>
    )
  }
}
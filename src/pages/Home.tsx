import React, {Component} from 'react'
import { observer} from 'mobx-react'
import {autorun} from 'mobx'
import {devicesInfoStore} from '../store/devices/devicesinfo'
import MotorSVG from  '../assets/svg/vteg.svg'
import {TSVGTemplateElement, loadSVGTemplateElements} from '../lib/svg/lib/svggroup'
import {TSVGComponent, getTags, drawComponents} from '../lib/svg/lib/components/TSVGComponent'
import { createSVGComponents } from '../lib/svg/lib/components/svgCompFabrica'

/*
interface HomeProps {
  store?: TDeviceStore
}
@inject('stores')
*/
@observer
//export default class Home extends Component<HomeProps> {
export default class Home extends Component {
  private svgComponents: Array<TSVGComponent> = [];

  constructor (props: any){
    super(props)
  }

  private putValuesToSVGTemplate(changed: any){
    drawComponents(this.svgComponents, devicesInfoStore.getTagValue.bind(devicesInfoStore));
  }
 
  private createAutorunInitiatorValues(){
    //запустить автообновление при изменении времени появления новой инфы
    const changes: Array<any> = devicesInfoStore.getObservableValues(getTags(this.svgComponents))
    changes.forEach(item=>{
      autorun(()=>{this.putValuesToSVGTemplate(item.time)})
    })
  }

  handleImageLoaded() {
    console.log('svg загружен')
    const elements: Array<TSVGTemplateElement> = loadSVGTemplateElements('vteg');
    this.svgComponents = createSVGComponents(elements)
    this.createAutorunInitiatorValues();
  }

  render() {
    console.log('Home render')
    return(
      <>
        <h1>Home </h1>
        <object className="mt-1" id="vteg" type="image/svg+xml"
            data={MotorSVG}
            onLoad={()=>{this.handleImageLoaded()}}
            > {/*width="100%" height="100%"*/}
        </object>	      
      </>
    )
  }
}
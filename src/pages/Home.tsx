import React, {Component} from 'react'
import { observer} from 'mobx-react'
import {autorun} from 'mobx'
import {devicesInfoStore} from '../store/devices/devicesinfo'
import MotorSVG from  '../assets/svg/vteg.svg'
import {TSVGTemplateElement, loadSVGTemplateElements} from '../lib/svg/lib/svggroup'
import {TSVGComponent, getTags, drawComponents} from '../lib/svg/lib/components/TSVGComponent'
import { createSVGComponents } from '../lib/svg/lib/components/svgCompFactory'

@observer
//export default class Home extends Component<HomeProps> {
export default class Home extends Component {
  private svgComponents: Array<TSVGComponent> = [];
  private handlers: Array<any> = [];

  constructor (props: any){
    super(props)
  }

  private putValuesToSVGTemplate(changed: any){
    drawComponents(this.svgComponents, devicesInfoStore.getTagProperties.bind(devicesInfoStore));
  }
 
  private createAutorunInitiatorValues(){
    //запустить автообновление при изменении времени появления новой инфы
    const changes: Array<any> = devicesInfoStore.getObservableValues(getTags(this.svgComponents))
    this.handlers = changes.map(item => autorun(()=>{this.putValuesToSVGTemplate(item.time)}))
  }

  handleImageLoaded() {
    //svg загружен
    const elements: Array<TSVGTemplateElement> = loadSVGTemplateElements('vteg');
    this.svgComponents = createSVGComponents(elements)
    this.createAutorunInitiatorValues();
  }

  render() {
    return(
      <>
        <h1>Home</h1>
        <object className="mt-1" id="vteg" type="image/svg+xml"
            data={MotorSVG}
            onLoad={()=>{this.handleImageLoaded()}}
            >
        </object>
      </>
    )
  }
}
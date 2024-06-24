import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { autorun } from 'mobx';
import { devicesInfoStore } from '../../store/devices/devicesinfo';
import MotorSVG from '../../assets/svg/vteg.svg';
// import MotorSVG from  "!file-loader!../../assets/svg/vteg.svg"
// import Logo from "!file-loader!./logo.svg";
import { TSVGTemplateElement, loadSVGTemplateElements } from '../../lib/svg/lib/svggroup';
import { TSVGComponent, getTags, drawComponents } from '../../lib/svg/lib/components/TSVGComponent';
import { createSVGComponents } from '../../lib/svg/lib/components/svgCompFactory';
import './Home.css';

@observer
// export default class Home extends Component<HomeProps> {
export default class Home extends Component {
  private svgComponents: Array<TSVGComponent> = [];
  private handlers: Array<any> = [];

  private putValuesToSVGTemplate (changed: any) {
    drawComponents(this.svgComponents, devicesInfoStore.getTagProperties.bind(devicesInfoStore));
  }

  private createAutorunInitiatorValues () {
    // запустить автообновление при изменении времени появления новой инфы
    const changes: Array<any> = devicesInfoStore.getObservableValues(getTags(this.svgComponents));
    this.handlers = changes.map(item => autorun(() => { this.putValuesToSVGTemplate(item.time) }));
  }

  handleImageLoaded () {
    // svg загружен
    const elements: Array<TSVGTemplateElement> = loadSVGTemplateElements('vteg');
    this.svgComponents = createSVGComponents(elements)
    this.createAutorunInitiatorValues();
  }

  render () {
    return (
      <div className="Home_flex">
        <object className="m-1" id="vteg" type="image/svg+xml"
            data={MotorSVG}
            onLoad={() => { this.handleImageLoaded() }}
            >
        </object>
      </div>
    )
  }
}

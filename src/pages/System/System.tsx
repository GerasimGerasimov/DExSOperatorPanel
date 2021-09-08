import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import SystemServicesController, { ISystemHostTime } from '../../controllers/system-services/system-services';
import './System.css';

interface ISystemState {
  IP: string;
  time: ISystemHostTime;
}


export default class System extends Component <{}, ISystemState> {

  private updateTimer: any = undefined;

  constructor () {
    super({});
    this.state = {
      IP:'0.0.0.0',
      time: {
        ISO: '',
        Local: '',
        UNIX: 0
      }
    }
  }

  private async updateTime(){
    try {
      const time: ISystemHostTime = await SystemServicesController.getTime();
      this.setState({time});
    } catch (e) {
      console.log(e);
      let time = {... this.state.time};
      time.Local = 'unnown'
      this.setState({time})
    }
  }

  private async getTime() {
    try {
      const IP: string = await SystemServicesController.getIP();
      this.setState({IP});
    } catch (e) {
      console.log(e);
      let IP: string = 'unnown'
      this.setState({IP})
    }
  }

  componentDidMount(){
    this.getTime();
    this.updateTimer = setInterval(async ()=>{this.updateTime()}, 1000);
  }

  componentWillUnmount(){
    clearInterval(this.updateTimer);
  }

  render() {
    return(
      <div className="jumbotron jumbotron-fluid">
      <div className="container">
          <h1 className="display-4">
              System
          </h1>
          <p className="lead">
              IP:<strong>{this.state.IP}</strong>
          </p>
          <p className="lead">
              Host Time:<strong>{this.state.time.Local}</strong>
          </p>
          <Link to="/" className="btn btn-primary">Back to Home</Link>
      </div>
  </div>
    )
  }
}
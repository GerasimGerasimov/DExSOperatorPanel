import React from 'react';
import {BrowserRouter, Switch, Route} from 'react-router-dom'
import './App.css';
import Home from './pages/Home';
import { Navbar } from './components/containers/navbar/Navbar';
import { About } from './pages/About';
import Trands from './pages/Trands/Trands';
import Devices from './pages/settings/Devices';
import DevicesRouter from './pages/settings/DevicesRouter';
import DeviceParameters from './pages/settings/DeviceParameters';
import Events from './pages/Events/Events';

function App() {
  return (
    <BrowserRouter>
      <div>
      <Navbar/>
        <Switch>
          <Route exact path="/" component={Home}/>
          <Route exact path="/trands" component={Trands}/>
          <Route exact path="/devices" component={Devices}/>
          <Route exact path="/devices/:position" component={DevicesRouter}/>
          <Route path="/devices/:position/:list" component={DeviceParameters}/>
          <Route path="/events" component={Events}/>
          <Route path="/about" component={About}/>
        </Switch>
      </div>
    </BrowserRouter>
  );
}

export default App;

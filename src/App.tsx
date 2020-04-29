import React from 'react';
import {BrowserRouter, Switch, Route} from 'react-router-dom'
import './App.css';
import Home from './pages/Home';
import { Navbar } from './components/containers/Navbar';
import { About } from './pages/About';
import { Profile } from './pages/Profile';
import DeviceSettings from './pages/DeviceSettings';

function App() {
  return (
    <BrowserRouter>
      <Navbar/>
      <div className="container pt-4">
        <Switch>
          <Route path="/devsettings" component={DeviceSettings}/>
          <Route path="/" exact component={Home}/>
          <Route path="/about" component={About}/>
          <Route path="/profile/:name" component={Profile}/>
        </Switch>
      </div>
    </BrowserRouter>
  );
}

export default App;

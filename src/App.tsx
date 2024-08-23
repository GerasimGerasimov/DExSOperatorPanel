import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import './App.css';
import { Navbar } from './components/containers/navbar/Navbar';
import { About } from './pages/About';
import Trands from './pages/Trands/Trands';
import Devices from './pages/settings/Devices';
import DevicesRouter from './pages/settings/DevicesRouter';
import DeviceParameters from './pages/settings/DeviceParameters';
import DateCardsContainer from './dexop-event-log-reader/event-log-reader/date-cards-container/date-card-container';
import EventTablePage from './dexop-event-log-reader/event-table/Pages/Events/event-table-page';
import System from './pages/System/System';
import Home from './pages/Home/Home';
import { Users } from './components/Users/Users';
import { UpdateUserForm } from './components/Users/forms/UpdateUserForm/UpdateUserForm';
import { CreateUserForm } from './components/Users/forms/CreateUserForm/CreateUserForm';
// import Events from './pages/Events/Events';
import { LoginForm } from './components/Users/forms/LoginForm/LoginForm';

function App () {
  return (
    <BrowserRouter>
      <div>
      <Navbar/>
        <Switch>
          <Route
            exact
            path="/"
            component={Home}
          />
          <Route
            exact
            path="/trands"
            component={Trands}
          />
          <Route
            exact
            path="/users"
            component={Users}
          />
          <Route
            exact
            path="/devices"
            component={Devices}
          />
          <Route
            exact
            path="/devices/:position"
            component={DevicesRouter}
          />
          <Route
            path="/devices/:position/:list"
            component={DeviceParameters}
          />
          <Route
            exact
            path="/events"
            component={DateCardsContainer}
          />
          <Route
            exact
            path="/events/:date"
            component={EventTablePage}
          />
          <Route
            path="/system"
            component={System}
          />
          <Route
            path="/about"
            component={About}
          />
          <Route
            path="/edit-user/:id"
            component={UpdateUserForm}
          />
          <Route
            path="/create-user"
            component={CreateUserForm}
          />
          <Route
            path="/login"
            component={LoginForm}
          />
        </Switch>
      </div>
    </BrowserRouter>
  );
}

export default App;
// <! -- <Route path="/events" component={Events}/ -->

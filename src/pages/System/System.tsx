import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import './System.css';

export default class System extends Component {

  render() {
    return(
      <div className="jumbotron jumbotron-fluid">
      <div className="container">
          <h1 className="display-4">
              System
          </h1>
          <p className="lead">
              IP:
              <strong>0.0.0.0</strong>
          </p>
          <Link to="/" className="btn btn-primary">Back to Home</Link>
      </div>
  </div>
    )
  }
}
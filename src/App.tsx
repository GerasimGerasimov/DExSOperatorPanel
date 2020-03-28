import React from 'react';
import logo from './logo.svg';
import './App.css';
import HelloWording from './components/hw/hw';
import Clock from './components/clock/Clock';

const numbers:Array<number> = [1,2,3];
const listItems = numbers.map((item: number) => {
  <li>{item}</li>
})  

function App() {

  return (
    <div className="App">
      <HelloWording name="Alisa"/>
      <ul>{listItems}</ul>
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <button>или уже не надо</button>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React and enjoi
        </a>
      </header>
    </div>
  );
}

export default App;

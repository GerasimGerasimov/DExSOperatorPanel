import React from 'react';
import './App.css';
import { Main } from './components/containers/main';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        {Main({})}
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;

import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import {Provider} from 'mobx-react';
import mainStore from './store/mainStore'
import { loadSVGImages } from './lib/svg/svgloadimages';
import { Trands } from './lib/trands/trands'

const stores = {
  mainStore,
  DeviceStore: mainStore.devicesValueStore
};

Trands.loadConfig();

loadSVGImages()
.then(()=>{//после подгрузки картинок, будет запущенj React приложение
  ReactDOM.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
    document.getElementById('root')
  )}
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

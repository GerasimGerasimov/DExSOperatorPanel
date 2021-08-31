import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import mainStore from './store/mainStore'
import { loadSVGImages } from './lib/svg/svgloadimages';
import { Trands } from './lib/trands/trands'
import { ModelDates } from './dexop-event-log-reader/event-models/dates/dates-model';

const stores = {
  mainStore,
  DeviceStore: mainStore.devicesValueStore
};

(async () => {
  try {
    await stores.mainStore.devicesInfoStore.getDevicesInfo();//загрузить ini-структуры из Tegger
    stores.mainStore.devicesValueStore.createTasksAndStartDataLoop();
    await Trands.loadConfig()//это конфигурация трендов
    Trands.startUpdateTimer();
    await loadSVGImages();
    startApp();
  } catch (e) {
    console.log('AppError', e);
  }
})()

ModelDates.init();

function startApp () {//после подгрузки картинок, будет запущенj React приложение
  ReactDOM.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
    document.getElementById('root')
  )}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
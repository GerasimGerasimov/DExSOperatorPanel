import {devicesValueStore, TDevicesValueStore} from "./devices/devices";
import { TDevicesInfoStore, devicesInfoStore } from "./devices/devicesinfo";

export class mainStore {
    public token: string = '';
    public devicesValueStore: TDevicesValueStore;
    public devicesInfoStore: TDevicesInfoStore;
    
    constructor (){
        this.devicesInfoStore = devicesInfoStore;
        this.devicesValueStore = devicesValueStore;
    }
}

export default new mainStore();
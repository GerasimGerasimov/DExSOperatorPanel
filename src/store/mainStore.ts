import {devicesValueStore, TDevicesValueStore} from "./devices/devices";
import { TDevicesInfoStore, devicesInfoStore } from "./devices/devicesinfo";

export class mainStore {
    public devicesValueStore: TDevicesValueStore;
    public devicesInfoStore: TDevicesInfoStore;
    
    constructor (){
        this.devicesValueStore = devicesValueStore;
        this.devicesInfoStore = devicesInfoStore;
    }
}

export default new mainStore();
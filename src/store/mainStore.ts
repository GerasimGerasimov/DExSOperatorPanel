import {devicesValueStore, TDevicesValueStore} from "./devices/devices";
import { TDeviceInfoStore, devicesInfoStore } from "./devices/devicesinfo";

export class mainStore {
    public devicesValueStore: TDevicesValueStore;
    public devicesInfoStore: TDeviceInfoStore;
    
    constructor (){
        this.devicesValueStore = devicesValueStore;
        this.devicesInfoStore = devicesInfoStore;
    }
}

export default new mainStore();
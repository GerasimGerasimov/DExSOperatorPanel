import {deviceStore, TDeviceStore} from "./devices/devices";

export class mainStore {
    public deviceStore: TDeviceStore;
    
    constructor (){
        this.deviceStore = deviceStore;
    }
}

export default new mainStore();
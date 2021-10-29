import HostController from "../controllers/devices/ws/client/controller";
import { urlTaggerService } from "../services-urls";
import {devicesValueStore, TDevicesValueStore} from "./devices/devices";
import { TDevicesInfoStore, devicesInfoStore } from "./devices/devicesinfo";

export class mainStore {
    public token: string = '';
    public devicesValueStore: TDevicesValueStore;
    public devicesInfoStore: TDevicesInfoStore;
    public Tagger: HostController;
    constructor (){
        this.Tagger = new HostController({host: urlTaggerService});
        this.devicesInfoStore = devicesInfoStore;
        this.devicesValueStore = devicesValueStore;
    }
}

export default new mainStore();
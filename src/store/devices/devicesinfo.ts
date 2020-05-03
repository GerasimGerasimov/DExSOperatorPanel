import {observable, action, autorun, runInAction, computed} from 'mobx';
import DeviceController from '../../controllers/devices/device'

enum FetchState {
    pending = 'pending',
    done    = 'done',
    error   = 'error'
}


export class TDeviceInfoRAW {
    PositionName: string = '';
    Description: string = '';
    Pages: Array<string> = [];
    Slots: Array<string> = [];
    Tags: any = {}
}

export class TDevicesInfoStore {
    @observable state: FetchState = FetchState.done;
    public DevicesInfo: Map<string, TDeviceInfoRAW> = new Map<string, TDeviceInfoRAW>();

    private autoReloadTimer: any;

    constructor() {
        this.getDevicesInfo();
        //this.tickTimer();
        //this.startAutoReloadData();
    }

    @action
    private async getDevicesInfo(){
        clearTimeout(this.autoReloadTimer);
        this.state = FetchState.pending;
        try {
            const data = await DeviceController.getDevicesInfo();
            runInAction(()=>{
                this.state = FetchState.done;
                const DevicesInfo: any = data || {};
                this.parseDevicesInfoRAWData(DevicesInfo);
            })
        } catch (e) {
            runInAction(()=>{
                this.state = FetchState.error;
                /*
                this.changeTime = new Date().toISOString();
                this.pureDeviceData = {};
                */
                console.log(e);
            })
        }
        //this.startAutoReloadData();
    }

    private parseDevicesInfoRAWData(DevicesInfo: any) {
        console.log(DevicesInfo);
        for (const key in DevicesInfo) {
            let info: TDeviceInfoRAW = DevicesInfo[key];
            //TODO поле Pages может быть пустым, поэтому его надо
            //"собрать" в Три вкладки
            this.addDefaultPages(info);
            this.DevicesInfo.set(key, info);
        }
    }

    private addDefaultPages(info: TDeviceInfoRAW) {

    }
}

export const devicesInfoStore:TDevicesInfoStore = new TDevicesInfoStore();

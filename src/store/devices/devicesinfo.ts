import {observable, action, autorun, runInAction, computed} from 'mobx';
import DeviceController from '../../controllers/devices/device'

enum FetchState {
    pending = 'pending',
    done    = 'done',
    error   = 'error'
}

export class TDeviceInfoStore {

    @observable state: FetchState = FetchState.done;
    public pureDeviceData: object = {};
    private autoReloadTimer: any;

    constructor() {
        //this.tickTimer();
        this.startAutoReloadData();
    }

    @action
    private async getDevicesInfo(){
        clearTimeout(this.autoReloadTimer);
        this.state = FetchState.pending;
        try {
            const data = await DeviceController.getDevicesInfo();
            runInAction(()=>{
                this.state = FetchState.done;
                console.log(data);
                /*
                this.changeTime = data.time;
                this.pureDeviceData = data.data;
                */
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
        this.startAutoReloadData();
    }
    
    @action
    private startAutoReloadData() {
        this.autoReloadTimer = setTimeout(async ()=>{
            await this.getDevicesInfo()
        },
        20)
    }

    private tickTimer(){
        setInterval(()=>{
            //this.incCounter();
        }, 1000);
    }
}

export const devicesInfoStore:TDeviceInfoStore = new TDeviceInfoStore();

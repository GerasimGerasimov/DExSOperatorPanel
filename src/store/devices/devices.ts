import {observable, action, autorun, runInAction} from 'mobx';
import DeviceController from '../../controllers/devices/device'

const task = {
    U1:{
    'RAM':'ALL',
    'CD':'ALL',
    'FLASH':'ALL'
    }
}

enum FetchState {
    pending = 'pending',
    done    = 'done',
    error   = 'error'
}

export class TDeviceStore {
    @observable count: number = 0;
    @observable DeviceData: object = {};
    @observable state: FetchState = FetchState.done;

    constructor() {
        this.tickTimer()
    }

    @action
    incCounter(){
        this.getDeviceData()
        this.count++;
    }

    @action
    async getDeviceData(){
        this.DeviceData = {};
        this.state = FetchState.pending;
        try {
            const data = await DeviceController.getData(task);
            runInAction(()=>{
                this.state = FetchState.done;
                this.DeviceData = data;
                console.log(data);
            })
        } catch (e) {
            runInAction(()=>{
                this.state = FetchState.error;
                console.log(e);
            })
        }

    }

    tickTimer(){
        setInterval(()=>{
            this.incCounter();
        }, 10);
    }


}

export const deviceStore:TDeviceStore = new TDeviceStore();

autorun(()=>{
    console.log('autorun:',deviceStore.count)});
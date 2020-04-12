import {observable, action, autorun, runInAction, computed} from 'mobx';
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
    @observable changeTime: string = "";
    @observable state: FetchState = FetchState.done;
    public pureDeviceData: object = {};
    private autoReloadTimer: any;

    constructor() {
        this.tickTimer();
        this.startAutoReloadData();
    }

    @action
    incCounter(){
        this.count++;
    }

    @action
    async getDeviceData(){
        clearTimeout(this.autoReloadTimer);
        this.state = FetchState.pending;
        try {
            const data = await DeviceController.getData(task);
            runInAction(()=>{
                this.state = FetchState.done;
                this.changeTime = data.time;
                this.pureDeviceData = data;
            })
        } catch (e) {
            runInAction(()=>{
                this.state = FetchState.error;
                this.changeTime = new Date().toISOString();
                this.pureDeviceData = {};
                console.log(e);
            })
        }
        this.startAutoReloadData();
    }
    
    @action
    private startAutoReloadData() {
        this.autoReloadTimer = setTimeout(async ()=>{
            await this.getDeviceData()
        },
        10)
    }

    tickTimer(){
        setInterval(()=>{
            this.incCounter();
        }, 100);
    }


}

export const deviceStore:TDeviceStore = new TDeviceStore();

/*
autorun(()=>{
    console.log('autorun:',deviceStore.count)});
    */
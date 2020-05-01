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
                this.pureDeviceData = data.data;
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
        20)
    }

    tickTimer(){
        setInterval(()=>{
            this.incCounter();
        }, 1000);
    }

    // U1>U1:RAM>data>Iexc
    public getTagData(tag: string) {
        const keyList: Array<string> = tag.split('>')
        var o: any = this.pureDeviceData;;
        var value: any;
        keyList.forEach((key:string)=>{
        value = key in o ? o[key] : undefined;
        if (!value) return '';
        o = value;
        })
        return value;
    }
}

export const deviceStore:TDeviceStore = new TDeviceStore();

/*
autorun(()=>{
    console.log('autorun:',deviceStore.count)});
    */
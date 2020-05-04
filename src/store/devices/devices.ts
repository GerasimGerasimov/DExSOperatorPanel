import {observable, action, autorun, runInAction} from 'mobx';
import DeviceController from '../../controllers/devices/device'
import {devicesInfoStore} from './devicesinfo'
import { FetchState } from '../../lib/util/misctypes';

const task = {
    U1:{
    'RAM':'ALL',
    'CD':'ALL',
    'FLASH':'ALL'
    }
}

export class TDevicesValueStore {
    @observable count: number = 0;
    @observable changeTime: string = "";
    @observable state: FetchState = FetchState.done;
    public pureDeviceData: object = {};
    private autoReloadTimer: any;

    constructor() {
        this.tickTimer();
        
        autorun(()=>{this.isDevicesInfoLoaded(devicesInfoStore.loadState)});
    }

    private isDevicesInfoLoaded(state: FetchState ){
        if (state === FetchState.done) {//инфа об устройствах прогрузилась, далее
            //1. создать запросы
            const tasks: Array<Object> = devicesInfoStore.createRequests()
            //2. запустить цикл чтения данных
            this.startAutoReloadData();
        }
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
        120)
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

export const devicesValueStore:TDevicesValueStore = new TDevicesValueStore();
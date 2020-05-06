import {observable, action, autorun, runInAction} from 'mobx';
import DeviceController from '../../controllers/devices/device'
import {devicesInfoStore} from './devicesinfo'
import { FetchState } from '../../lib/util/misctypes';

export class TDevicesValueStore {
    @observable count: number = 0;
    @observable changeTime: string = "";
    @observable state: FetchState = FetchState.done;
    public pureDeviceData: any = {};
    private autoReloadTimer: any;
    private Tasks = {
        index: 0 as number,
        tasks: [] as Array<object>
    }

    constructor() {
        this.tickTimer();
        autorun(()=>{this.isDevicesInfoLoaded(devicesInfoStore.loadState)});
    }

    private isDevicesInfoLoaded(state: FetchState ){
        if (state === FetchState.done) {
            this.createTasksAndStartDataLoop();//инфа об устройствах прогрузилась
        }
    }

    private createTasksAndStartDataLoop () {
        //1. создать запросы
        this.Tasks = {
            index: 0,
            tasks: devicesInfoStore.createRequests()
        }
        //2. запустить цикл чтения данных
        this.startAutoReloadData();
    }

    @action
    incCounter(){
        this.count++;
    }

    @action
    async getDeviceData(task: any){
        clearTimeout(this.autoReloadTimer);
        this.state = FetchState.pending;
        try {
            const data = await DeviceController.getData(task);
            runInAction(()=>{
                this.state = FetchState.done;
                this.changeTime = data.time;
                for( const key in data.data) {
                    this.pureDeviceData[key] = data.data[key]
                    devicesInfoStore.fillValuesFromReceivedData(data.data[key]);
                }
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
            const task: any = this.Tasks.tasks[this.Tasks.index]
            await this.getDeviceData(task);
            if (++this.Tasks.index === this.Tasks.tasks.length)
                this.Tasks.index = 0;
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
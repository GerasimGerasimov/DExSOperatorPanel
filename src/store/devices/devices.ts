import {observable, action, autorun} from 'mobx'

export class TDeviceStore {
    @observable count: number = 0;

    constructor() {
        this.tickTimer()
    }

    @action incCounter(){
        this.count++;
    }

    tickTimer(){
        setInterval(()=>{
            this.incCounter();
        }, 1000);
    }
}

export const deviceStore:TDeviceStore = new TDeviceStore();

autorun(()=>{
    console.log('autorun:',deviceStore.count)});
import { observable, action, runInAction } from 'mobx';
import DeviceController from '../../controllers/devices/http/device'
import { devicesInfoStore } from './devicesinfo'

/** TODO запрашивать данные по WS */
export class TDevicesValueStore {
    @observable count: number = 0;
    private autoReloadTimer: any;
    private Tasks = {
        index: 0 as number,
        tasks: [] as Array<object>
    }

    constructor () {
        this.tickTimer();
    }

    public createTasksAndStartDataLoop () {
        // 1. создать запросы
        this.Tasks = {
            index: 0,
            tasks: devicesInfoStore.createRequests()
        }
        // 2. запустить цикл чтения данных
        this.startAutoReloadData();
    }

    @action
    incCounter () {
        this.count++;
    }

    @action
    async getDeviceData (task: any) {
        clearTimeout(this.autoReloadTimer);
        try {
            const data = await DeviceController.getData(task);
            runInAction(() => {
                for (const key in data) {
                    devicesInfoStore.fillValuesFromReceivedData(data[key]);
                }
            })
        } catch (e) {
            runInAction(() => {
                // console.log(e);
            })
        }
        this.startAutoReloadData();
    }

    @action
    private startAutoReloadData () {
        this.autoReloadTimer = setTimeout(async () => {
            const task: any = this.Tasks.tasks[this.Tasks.index]
            await this.getDeviceData(task);
            if (++this.Tasks.index === this.Tasks.tasks.length) {
                this.Tasks.index = 0;
            }
        }, 10)
    }

    tickTimer () {
        setInterval(() => {
            this.incCounter();
        }, 1000);
    }
}

export const devicesValueStore: TDevicesValueStore = new TDevicesValueStore();

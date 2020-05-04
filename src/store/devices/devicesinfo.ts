import {observable, action, runInAction} from 'mobx';
import DeviceController from '../../controllers/devices/device'
import { isEmpty } from '../../lib/util/commonmisc';
import { FetchState } from '../../lib/util/misctypes';

export class TDeviceInfoRAW {
    PositionName: string = '';
    Description: string = '';
    Pages: Array<string> = [];
    Slots: Array<string> = [];
    Tags: any = {}
}

export class TDevicesInfoStore {
    @observable loadState: FetchState = FetchState.done;
    public DevicesInfo: Map<string, TDeviceInfoRAW> = new Map<string, TDeviceInfoRAW>();

    constructor() {
        this.getDevicesInfo();
    }

    @action
    private async getDevicesInfo(){
        this.loadState = FetchState.pending;
        try {
            const data = await DeviceController.getDevicesInfo();
            runInAction(()=>{
                this.loadState = FetchState.done;
                const DevicesInfo: any = data || {};
                this.parseDevicesInfoRAWData(DevicesInfo);
            })
        } catch (e) {
            runInAction(()=>{
                this.loadState = FetchState.error;
                console.log(e);
            })
        }
    }

    /* после чтения конфигурации устройств,
       есть информация по кол-ву устройств и слотов в них
       поэтому можно сформировать массив объектов запросов
        [ {"U1":{"RAM":"ALL"}}, {"U2":{"FLASH":"ALL"}}
    */
    public createRequests(): Array<Object>{
        const tasks: Array<Object> = [] 
        for (let [key, value] of this.DevicesInfo) {
            let info: TDeviceInfoRAW = value;
            let o: any = {};
            o[key] = {};
            for (let tag in info.Tags) {
                if (!isEmpty(info.Tags[tag]))
                    o[key][tag.toUpperCase()] = 'ALL'
            }
            tasks.push(o);
        }
        return tasks;
    }

    private parseDevicesInfoRAWData(DevicesInfo: any) {
        console.log(DevicesInfo);
        for (const key in DevicesInfo) {
            let info: TDeviceInfoRAW = DevicesInfo[key];
            //TODO поле Pages может быть пустым, поэтому его надо
            //"собрать" в такое ко-во вскладок сколько есть секций (flash, ram, cd)
            this.addDefaultPages(info);
            this.DevicesInfo.set(key, info);
        }
    }

    private addDefaultPages(info: TDeviceInfoRAW) {
        if (info.Pages.length === 0) {
            const Tags = info.Tags;
            for (const tag in Tags) {
                if (!isEmpty(Tags[tag])) {
                    info.Pages.push(this.fillPageStr(tag, Tags[tag]))
                }
            }
        }
    }

    //p0=Самовозбуждение/FLASH:SelfExciteEnable,FLASH:Ready_GS_ON/
    private fillPageStr(section: string, parameters: any): string{
        console.log(section, parameters);
        const sectionName: string = section.toLocaleUpperCase();
        var res: string = `${sectionName}=${sectionName}/`
        for (const key in parameters) {
            const value: string = `${sectionName}:${parameters[key].name},`;
            res += value;
        }
        res = res.slice(0,-1);//удаляю последний символ (лишнюю запятую)
        res +='/';
        return res;
    }
}

export const devicesInfoStore:TDevicesInfoStore = new TDevicesInfoStore();

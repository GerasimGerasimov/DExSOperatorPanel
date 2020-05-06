import {observable, action, runInAction} from 'mobx';
import DeviceController from '../../controllers/devices/device'
import { isEmpty, getArrFromDelimitedStr } from '../../lib/util/commonmisc';
import { FetchState } from '../../lib/util/misctypes';

class TParameterFromAPI {
    name: string = '';
    comment: string = '';
    msu: string = '';
    objType: string = '';
}

class TParameter {
    comment: string = '';
    msu: string = '';
    objType: string = '';
    value: string = ''
}

class TParameters {
    @observable time: string = new Date().toISOString();
    params: Map<string, TParameter> = new Map<string, TParameter>();
}

class TTags {
    ram!: TParameters;
    flash!: TParameters;
    cd!: TParameters;
}

class TPositionAndSection {
    position: string = '';
    section: string = ''
}

export class TDeviceInfoRAW {
    PositionName: string = '';
    Description: string = '';
    Pages: Array<string> = [];
    Slots: Array<string> = [];
    Tags: TTags = {
        ram: {
            time: new Date().toISOString(),
            params: new Map<string, TParameter>()},
        flash: {
            time: new Date().toISOString(),
            params: new Map<string, TParameter>()},
        cd:{time: new Date().toISOString(),
            params: new Map<string, TParameter>()}
    };
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
            const Tags: any = info.Tags;
            for (let tag in Tags) {
                if (!isEmpty(Tags[tag]))
                    o[key][tag.toUpperCase()] = 'ALL'
            }
            tasks.push(o);
        }
        return tasks;
    }

    private parseDevicesInfoRAWData(DevicesInfo: any) {
        for (const key in DevicesInfo) {
            let info: TDeviceInfoRAW = DevicesInfo[key];
            //TODO поле Pages может быть пустым, поэтому его надо
            //"собрать" в такое ко-во вскладок сколько есть секций (flash, ram, cd)
            this.addDefaultPages(info);
            this.parseParameters(info);
            this.DevicesInfo.set(key, info);
        }
    }

    //Meняет структуру параметров на TParameters 
    private parseParameters(info: TDeviceInfoRAW) {
        const Tags: any = info.Tags;
        for (let key in Tags) {
            const source: any= Tags[key];
            const dest: TParameters = new TParameters();
            for (let key in source) {
                const value: TParameterFromAPI= source[key];
                const {name} = value;
                let param: TParameter = new TParameter();
                param = {
                    comment: value.comment,
                    msu: value.msu,
                    objType: value.objType,
                    value:''
                }
                dest.params.set(name, param)
            }
            Tags[key] = dest;
        }
    }

    public fillValuesFromReceivedData(ReceivedData: any) {
        for (const slotName in ReceivedData) {
            const {position, section} = this.getPositionAndSection(slotName);
            const {time, status, data} = ReceivedData[slotName];
            if ((status === 'Error') || (data === undefined)) {
                this.fillValuesUndefineds({position, section} as TPositionAndSection)
            } else {
                this.fillValuesValidData({position, section} as TPositionAndSection, data, time)
            }
        }
        console.log(this.DevicesInfo)
    }

    private fillValuesUndefineds(PosAndSect:TPositionAndSection) {
        const {position, section} = PosAndSect;
        const destPos: TDeviceInfoRAW = this.DevicesInfo.get(position)!;
        const Tags: any = destPos.Tags;
        const dest: TParameters = Tags[section.toLocaleLowerCase()];
        dest.time = new Date().toISOString();
        dest.params.forEach((item: TParameter)=> {
            item.value = ''
        })
    }

    private fillValuesValidData(PosAndSect:TPositionAndSection, data: any, time: string) {
        const {position, section} = PosAndSect;
        const destPos: TDeviceInfoRAW = this.DevicesInfo.get(position)!;
        const Tags: any = destPos.Tags;
        const dest: TParameters = Tags[section.toLocaleLowerCase()];
        dest.time = time;
        for (var [key, value] of dest.params.entries()) {
            value.value = data[key] || '';
        }
    }

    private getPositionAndSection(slot: string): TPositionAndSection {
        const [position, section] = getArrFromDelimitedStr(slot,':');
        return {position, section}
    }
    private addDefaultPages(info: TDeviceInfoRAW) {
        if (info.Pages.length === 0) {
            const Tags: any = info.Tags;
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

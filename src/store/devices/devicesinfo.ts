import {observable, action, runInAction} from 'mobx';
import DeviceController from '../../controllers/devices/http/device'
import { isEmpty, getArrFromDelimitedStr } from '../../lib/util/commonmisc';

class TParameterFromAPI {
    name: string = '';
    comment: string = '';
    msu: string = '';
    objType: string = '';
}

export class TParameter {
    comment: string = '';
    msu: string = '';
    objType: string = '';
    value: string = ''
}

class TParameters {
    @observable time:string = new Date().toISOString()
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
        cd:{
            time: new Date().toISOString(),
            params: new Map<string, TParameter>()}
    };
}

export class TDevicesInfoStore {
    //@observable loadState: FetchState = FetchState.done;
    public DevicesInfo: Map<string, TDeviceInfoRAW> = new Map<string, TDeviceInfoRAW>();

    @action
    public async getDevicesInfo(): Promise<any>{
        try {
            const data = await DeviceController.getDevicesInfo();
            runInAction(()=>{
                const DevicesInfo: any = data || {};
                this.parseDevicesInfoRAWData(DevicesInfo);
            })
        } catch (e) {
            throw new Error('Tagger service is not responded')
        }
    }

    //сканирует список тегов U1/RAM/Iexc
    //выделяет из них Position/Section и выдаёт массив
    //(или set - посмотрю что будет срабатывать)
    //ссылок на отслеживаемые time для передачи в autorun
    public getObservableValues(tags:Array<string>):Array<any> {
        const res: Array<any> = [];
        const devices: Set<string> = new Set<string>();
        tags.forEach((item) => {
            let [position, section] = getArrFromDelimitedStr(item,'/');
            devices.add(`${position}/${section}`)
        })
        //тут теперь только уникальные сеты,
        //нужно выделить U1/RAM и U2/FLASH ... и ссылки на них положить в массив
        devices.forEach((item:string) => {
            let [position, section] = getArrFromDelimitedStr(item,'/');
            res.push(this.getTimeFromPositionSection(position, section));
        })
        return res;
    }

    private getTimeFromPositionSection(position: string, section: string): any {
        const Position: any = this.DevicesInfo.get(position)!;
        const Tags: TParameters = Position.Tags[section.toLocaleLowerCase()];
        return Tags;
    }

    //отдаёт значение по тегу U1/RAM/Iexc
    public getTagValue(request: string): string {
        const [position, section, tag] = getArrFromDelimitedStr(request,'/')
        const Position: any = this.DevicesInfo.get(position)!;
        const Tags: TParameters = Position.Tags[section.toLocaleLowerCase()];
        const value: string = Tags.params.get(tag)?.value || ''
        return value;
    }

    //Даёт прямой доступ к параметру и его данным
    public getParameter(request: string): TParameter | undefined {
        const [position, section, tag] = getArrFromDelimitedStr(request,'/')
        const Position: any = this.DevicesInfo.get(position)!;
        const Tags: TParameters = Position.Tags[section.toLocaleLowerCase()];
        const parameter: TParameter | undefined = Tags.params.get(tag)
        return parameter;
    }

    //отдаёт значение заданных свойств (value, msu) по тегу U1/RAM/Iexc
    public getTagProperties(Tag: string, properties: Array<string>): any {
        const [position, section, tag] = getArrFromDelimitedStr(Tag,'/')
        const Position: any = this.DevicesInfo.get(position)!;
        const Tags: TParameters = Position.Tags[section.toLocaleLowerCase()];
        const param: TParameter | any = Tags.params.get(tag);
        const res: any = {};
        properties.forEach((item: string) => {
            res[item] = param[item] || '';
        })
        return res;
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
            //"собрать" в такое ко-во вкладок сколько есть секций (flash, ram, cd)
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

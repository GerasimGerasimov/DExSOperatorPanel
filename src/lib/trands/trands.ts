/*
1) Загрузить инфу о трендах из trands.json
2) Создать объекты из трендов чтобы знать их Measure Units и тип
3) Зная deep создать массивы для каждого тренда
4) Создать автоматическое заполнение массивов тредов с интервалом interval мс
5) На странице Trands.tsx выводить Canvas с графиками.
   Высота графика в параметре height
6) Если в массиве tags несколько трендов то графики требуется совмещать
*/
import { getTextByURL } from '../svg/lib/utils';
import { TTrandsGroup } from './trandsgroup';
import TViewBoxModel from '../../pages/Trands/TViewBoxModel';
import { randomStringAsBase64Url } from '../util/cryputils';
import { IEventOnUpdate } from '../../interfaces/IEventOnUpdate';
import { IViewBoxModelProps } from '../../interfaces/IViewBoxModelProps';

const settingsURL = '/assets/trands/trands.json';

export class TTrands {
    private url: string = '';
    private deep: number = 0; // глубина архива
    private interval: number = 0; // интервал обновления данных
    private widthScale: number = 1; // масштаб по горизонтали
    private trandsGroups: Map<string, TTrandsGroup> = new Map();
    private viewBoxesModel: Map<string, TViewBoxModel> = new Map();
    private updateTimer: any = undefined;
    private count: number = 0;
    private onUpdateHandlers: Map<string, IEventOnUpdate | undefined> = new Map();
    private run: boolean = true;
    constructor (url: string = settingsURL) {
        this.url = url;
    }

    public setOnUpdate (handler: IEventOnUpdate): string {
        const ID: string = randomStringAsBase64Url(4);
        this.onUpdateHandlers.set(ID, handler);
        return ID;
    }

    public deleteOnUpdateByID (ID: string): void {
        this.onUpdateHandlers.delete(ID);
    }

    public get Deep (): number {
        return this.deep;
    }

    public get WidthScale (): number {
        return this.widthScale;
    }

    public set Run (value: boolean) {
        this.run = value;
    }

    public get Run (): boolean {
        return this.run;
    }

    public async loadConfig () {
        const text: string = await getTextByURL(this.url);
        const settings = await JSON.parse(text);
        this.deep = settings.deep || 0;
        this.interval = settings.interval || 0;
        this.widthScale = settings.initialWidthScale || 1;
        this.createTrandsGroups(settings.trands || undefined);
        this.createViewBoxesModels();
    }

    private createTrandsGroups (trands: any) {
        if (trands === undefined) {
            return;
        }
        for (const key in trands) {
            const value: any = trands[key];
            const group: TTrandsGroup = new TTrandsGroup(this.deep, value);
            this.trandsGroups.set(key, group);
        }
    }

    private createViewBoxesModels () {
        this.trandsGroups.forEach((trandsGroup: TTrandsGroup, key: string) => {
            const props: IViewBoxModelProps = {
                height: trandsGroup.getBoxHeight(),
                models: trandsGroup,
                deep: this.deep,
                WidthScale: this.widthScale
            }
            const viewBoxModel: TViewBoxModel = new TViewBoxModel(props);
            this.viewBoxesModel.set(key, viewBoxModel);
        });
    }

    public startUpdateTimer () {
        this.updateTimer = setInterval(this.updateTrandsValue.bind(this), this.interval);
    }

    private updateTrandsValue () {
      if (this.run) {
        this.trandsGroups.forEach((group:TTrandsGroup) => {
            group.setTagsValues();
            this.executeOnUpdateHandlers();
        });
      }
    }

    private executeOnUpdateHandlers () {
        this.onUpdateHandlers.forEach(handler => {
          if (handler) {
            handler();
          }
        });
    }

    public getBoxes ():Array<TViewBoxModel> {
        const res: Array<TViewBoxModel> = [];
        this.viewBoxesModel.forEach((box:TViewBoxModel) => {
            res.push(box);
        });
        return res;
    }
}

export const Trands = new TTrands();

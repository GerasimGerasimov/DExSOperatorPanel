import { TTrandHeight, TTrandsGroup } from '../../lib/trands/trandsgroup'
import { TTrand } from '../../lib/trands/trand';

export interface IViewBoxModelProps {
  height: TTrandHeight;
  models: TTrandsGroup;
}

export default class TViewBoxModel {
    //private shadowCanvas
    private height: TTrandHeight;
    private models: TTrandsGroup;

    constructor (props: IViewBoxModelProps){
      this.height = props.height;
      this.models = props.models
    }

    public get Height():TTrandHeight {
      return this.height;
    }

    public get Models(): Map<string, TTrand> {
      return this.models.Trands;
    }
}
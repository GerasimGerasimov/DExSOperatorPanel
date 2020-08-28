import { IViewTrandProp, TViewTrand } from "./TViewTrand"
import { TViewUInt16 } from "./TViewUInt16";
import { TViewBool } from "./TViewBool";


export default function ViewFactory (ObjType: string, props: IViewTrandProp): TViewTrand {
  const ObjTypes: {[index: string]: any} = {
      'TBit'  : () => {return new TViewBool(props)},
      'TWORD' : () => {return new TViewUInt16(props)},
      //'TByte' : () => {return new TModelUInt8(props)},
      //'TInteger' : () => {return new TModelInt16(props)},
      //'TFloat'   : () => {return new TModelFloat32(props)},
      'default': () => {
          console.log(`${ObjType} not found`)
          return undefined;
      }
  }
  return (ObjTypes[ObjType] || ObjTypes['default'])()
}
import { TModel, IModelProp } from "./TModel"
import { TModelBool } from "./TModelBool"
import { TModelUInt16 } from "./TModelUInt16"
import { TModelInt16 } from "./TModelInt16"
import { TModelUInt8 } from "./TModelUInt8"
import { TModelFloat32 } from "./TModelFloat32"

export default function ModelFactory (ObjType: string, props: IModelProp): TModel {
  const ObjTypes: {[index: string]: any} = {
      'TBit'  : () => {return new TModelBool(props)},
      'TWORD' : () => {return new TModelUInt16(props)},
      'TByte' : () => {return new TModelUInt8(props)},
      'TInteger' : () => {return new TModelInt16(props)},
      'TFloat'   : () => {return new TModelFloat32(props)},
      'default': () => {
          console.log(`${ObjType} not found`)
          return undefined;
      }
  }
  return (ObjTypes[ObjType] || ObjTypes['default'])()
}
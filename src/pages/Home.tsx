import React from 'react'
import {observer} from 'mobx-react'
import {deviceStore} from '../store/devices/devices'

export const Home: React.FunctionComponent = observer(({}) => {
  
  const storeData: any = deviceStore.pureDeviceData;
  //достоточно changeTime тут быть чтобы компонет перересовывался при обновлении
  //даных, хотя changeTime не используется в данном коде
  const changeTime: string = deviceStore.changeTime;

  // U1>U1:RAM>data>Iexc
  function getTagData(tag: string) {
    const keyList: Array<string> = tag.split('>')
    var o: any = storeData;
    var value: any;
    keyList.forEach((key:string)=>{
      value = key in o ? o[key] : undefined;
      if (!value) return undefined;
      o = value;
    })
    return value;
  }
 
  return(
    <>
      <h1>Home page</h1>
      <button type="button" className="btn btn-primary ml-1">
        <span className="badge badge-light bg-success">
          Count:
        </span>
        <span className="badge badge-light bg-warning ml-1">
          {deviceStore.count}
        </span>
      </button>
      <button type="button" className="btn btn-primary ml-1">
        <span className="badge badge-light bg-success">
          Ustat:
        </span>
        <span className="badge badge-light bg-warning ml-1">
            {getTagData('U1>U1:RAM>data>Ustat')}
        </span>
      </button>
      <button type="button" className="btn btn-primary ml-1">
        <span className="badge badge-light bg-success">
          Iexc:
        </span>
        <span className="badge badge-light bg-warning ml-1">
            {getTagData('U1>U1:RAM>data>Iexc')}
        </span>
      </button>
    </>
  )
})
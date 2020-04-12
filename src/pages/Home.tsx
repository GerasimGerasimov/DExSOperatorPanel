import React, {Fragment} from 'react'
import {observer} from 'mobx-react'
import {toJS} from 'mobx';
import {deviceStore} from '../store/devices/devices'

export const Home: React.FunctionComponent = observer(({}) => {
  
  function getIexc(payload: any): string {
    const o = toJS(payload);
    const extData = 'data' in o ? o['data'] : 'default'; 
    if (extData === 'default') return 'default';

    const inData = 'data' in extData ? extData['data'] : 'default';
    if (inData === 'default') return 'default';
 
    const u1Data = `U1` in inData ? inData['U1'] : 'default';
    if (u1Data === 'default') return 'default';

    const u1Ram = `U1:RAM` in u1Data ? u1Data['U1:RAM'] : 'default';
    if (u1Ram === 'default') return 'default';

    const u1RamData = `data` in u1Ram ? u1Ram['data'] : 'default';
    if (u1RamData === 'default') return 'default';

    const Iexc = `Iexc` in u1RamData ? u1RamData['Iexc'] : 'default';
    if (Iexc === 'default') return 'default';

    return Iexc;
  }

  return(
    <Fragment>
          <h1>Home page</h1>
          <button type="button" className="btn btn-primary">
              <span className="badge badge-light bg-success">
                Notifications:
              </span>
              <span className="badge badge-light bg-warning ml-1">
                {deviceStore.count}
              </span>
              <span className="badge badge-light bg-warning ml-1">
                Iexc={getIexc(deviceStore.DeviceData)}
              </span>
          </button>
    </Fragment>
  )
})
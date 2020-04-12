import React, {Fragment} from 'react'
import {observer} from 'mobx-react'
import {toJS} from 'mobx';
import {deviceStore} from '../store/devices/devices'

export const Home: React.FunctionComponent = observer(({}) => {
  
  function getUstat(payload: any): string {
    const o = toJS(payload);
    //  data/U1/U1:RAM/data/Iexc
    //  U1:RAM/Iexc
    const inData = 'data' in o ? o['data'] : 'default';
    if (inData === 'default') return 'default';
 
    const u1Data = `U1` in inData ? inData['U1'] : 'default';
    if (u1Data === 'default') return 'default';

    const u1Ram = `U1:RAM` in u1Data ? u1Data['U1:RAM'] : 'default';
    if (u1Ram === 'default') return 'default';

    const u1RamData = `data` in u1Ram ? u1Ram['data'] : 'default';
    if (u1RamData === 'default') return 'default';

    const Ustat = `Ustat` in u1RamData ? u1RamData['Ustat'] : 'default';
    if (Ustat === 'default') return 'default';

    return Ustat;
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
                Ustat={getUstat(deviceStore.DeviceData)}
              </span>
          </button>
    </Fragment>
  )
})
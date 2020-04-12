import React, {Fragment} from 'react'
import {observer} from 'mobx-react'
import {deviceStore} from '../store/devices/devices'

export const Home: React.FunctionComponent = observer(({}) => {
  
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
          </button>
    </Fragment>
  )
})
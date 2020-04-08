import React, {Fragment} from 'react'

export const Home: React.FunctionComponent = ({}) => (
  <Fragment>
        <h1>Home page</h1>
        <button type="button" className="btn btn-primary">
                Notifications <span className="badge badge-light bg-warning">4</span>
        </button>
  </Fragment>
)
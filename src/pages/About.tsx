import React from 'react'
import {Link} from 'react-router-dom'

export const About: React.FunctionComponent = ({}) => (
    <div className="jumbotron jumbotron-fluid">
        <div className="container">
            <h1 className="display-4">Информация</h1>
            <p className="lead">Версия приложения <strong>1.0.0</strong></p>
            <Link to="/" className="btn btn-primary">Back to Home</Link>
        </div>
    </div>
)
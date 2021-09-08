import React, {useState, useEffect} from 'react'
import {Link} from 'react-router-dom'

export const About: React.FunctionComponent = () => {
    const [count, setCount] = useState(0);

    useEffect(()=>{
       const id = setInterval(()=>{setCount(count + 1)},1);
       return () => clearInterval(id);
    },[count])

    return (
        <div className="jumbotron jumbotron-fluid">
            <div className="container">
                <h1 className="display-4">
                    DExS OP
                </h1>
                <div className="lead">
                    Версия приложения
                    <strong>2.0.0</strong>
                    <p>ООО "ИНТМАШ"</p>
                </div>
                <Link to="/" className="btn btn-primary">Back to Home</Link>
            </div>
        </div>
    )
}
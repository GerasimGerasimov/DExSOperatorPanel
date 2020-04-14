import React, {useState, useEffect} from 'react'
import {Link} from 'react-router-dom'
import MotorSVG from '../img/motor.svg'

export const About: React.FunctionComponent = ({}) => {
    const [count, setCount] = useState(0);

    useEffect(()=>{
       const id = setInterval(()=>{setCount(count + 1)},1);
       return () => clearInterval(id);
    },[count])

    return (
        <div className="jumbotron jumbotron-fluid">
            <div className="container">
                <h1 className="display-4">Информация</h1>
                <p className="lead">
                    Версия приложения
                    <strong>1.0.</strong>
                    <span className="badge badge-light bg-warning ml-1"
                        onClick={() => setCount(count + 1)}>
                        {count}
                    </span>
                </p>
                <Link to="/" className="btn btn-primary">Back to Home</Link>
                <object id="svg_motor_remake" type="image/svg+xml"
			        data={MotorSVG}  width="119.055mm" height="119.055mm">
	            </object>	
            </div>
        </div>
    )
}
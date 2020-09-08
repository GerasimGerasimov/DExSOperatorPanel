import React, { useState } from 'react';
import './TougleButton.css';
import { IToolButtonProps } from '../iToolButton';

export const TougleButton = (props: IToolButtonProps) => {
    const [tougle, changeTougle] = useState(props.isTougle || false);

    const classes = [
        'MenuButton',
        'fa',
        tougle
        ? (`${props.icon[0]} toogled`)
        : props.icon[1],
    ]

    const click = () => {
        changeTougle(!tougle);
        props.onClick(props.name, tougle)
    }

    return (
        <i 
            className = {classes.join(' ')}
            onClick={()=>click()}
        ></i>
    )
}
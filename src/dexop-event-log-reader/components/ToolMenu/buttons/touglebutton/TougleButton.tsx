import React from 'react';
import './TougleButton.css';
import { IToolButtonProps } from '../iToolButton';

export const TougleButton = (props: IToolButtonProps) => {

    const classes = [
        'MenuButton',
        'fa',
        props.isTougle
        ? (`${props.icon[0]} toogled`)
        : props.icon[1],
    ]

    const click = () => {
        props.onClick(props.name, props.isTougle)
    }

    return (
        <i 
            className = {classes.join(' ')}
            onClick={()=>click()}
        ></i>
    )
}
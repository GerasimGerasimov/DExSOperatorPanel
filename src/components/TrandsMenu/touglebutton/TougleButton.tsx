import React, { useState } from 'react';
import './TougleButton.css';

export interface ITougleButtonProps {
    name: string;
    icon: Array<string>;
    isTougle: boolean
    onClick: (e: any, tougle: boolean) => any;
}

export const TougleButton = (props: ITougleButtonProps) => {
    const [tougle, changeTougle] = useState(props.isTougle);

    const classes = [
        'MenuButton',
        'fa',
        tougle
        ? props.icon[0]
        : props.icon[1],
        'pressed'
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
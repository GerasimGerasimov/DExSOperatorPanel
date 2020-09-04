import React from 'react';
import './MenuButton.css';

export interface IMenuButtonProps {
    name: string;
    icon: string;
    onClick: (e: any, state: boolean) => any;
}

export const MenuButton = (props: IMenuButtonProps) => {
    const classes = [
        'MenuButton',
        'fa',
        props.icon,
        'pressed'
    ]

    return (
        <i 
            className = {classes.join(' ')}
            onClick={()=>props.onClick(props.name, false)}
        ></i>
    )
}
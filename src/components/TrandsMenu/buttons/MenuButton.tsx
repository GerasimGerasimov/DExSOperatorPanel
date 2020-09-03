import React from 'react';
import './MenuButton.css';

export interface IMenuButtonProps {
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
            onClick={(e)=>props.onClick(e, false)}
        ></i>
    )
}
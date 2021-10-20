import React from 'react';
import './MenuTougle.css';

export interface IMenuTougleProps {
    isOpen: boolean;
    onTougle: (e: any) => any;
}

export const MenuTougle = (props: IMenuTougleProps) => {
    const classes = [
        'MenuTougle',
        'fa',
        props.isOpen 
        ? 'fa-times open'
        : 'fa-bars' //'fa-chevron-left'
    ]

    return (
        <i 
            className = {classes.join(' ')}
            onClick={(e)=>props.onTougle(e)}
        ></i>
    )
}
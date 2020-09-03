import React from 'react';
import './OnLineButton.css';

export interface IOnLineButtonProps {
    isOpen: boolean;
    onTougle: (e: any) => any;
}

export const OnLineButton = (props: IOnLineButtonProps) => {
    const classes = [
        'OnLineButton',
        'fa',
        props.isOpen 
        ? 'fa-network-wired open'
        : 'fa-network-wired' //'fa-chevron-left'
    ]

    return (
        <i 
            className = {classes.join(' ')}
            onClick={(e)=>props.onTougle(e)}
        ></i>
    )
}
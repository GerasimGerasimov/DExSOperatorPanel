import React from 'react';
import './DBButton.css';

export interface IDBButtonProps {
    isOpen: boolean;
    onTougle: (e: any) => any;
}

export const DBButton = (props: IDBButtonProps) => {
    const classes = [
        'DBButton',
        'fa',
        props.isOpen 
        ? 'fa-database open'
        : 'fa-database'
    ]

    return (
        <i 
            className = {classes.join(' ')}
            onClick={(e)=>props.onTougle(e)}
        ></i>
    )
}
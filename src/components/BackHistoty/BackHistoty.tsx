import React from 'react';
import './BackHistoty.css';

export interface IBackHistotyProps {
    isOpen: boolean;
    onBack: (e: any) => any;
}

export const BackHistoty = (props: IBackHistotyProps) => {
    const classes = [
        'BackHistoty',
        'fa',
        'fa-chevron-left'
    ]

    return (
        <i 
            className = {classes.join(' ')}
            onClick={(e)=>props.onBack(e)}
        ></i>
    )
}
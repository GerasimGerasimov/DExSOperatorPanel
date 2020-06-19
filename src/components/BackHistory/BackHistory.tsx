import React from 'react';
import './BackHistory.css';

export interface IBackHistoryProps {
    onBack: (e: any) => any;
}

export const BackHistory = (props: IBackHistoryProps) => {
    const classes = [
        'BackHistory',
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
import React from 'react';
import './BackHistory.css';
import { IBackHistoryProps } from '../../interfaces/IBackHistory';

export const BackHistory = (props: IBackHistoryProps) => {
    const classes = [
        'BackHistory',
        'fa',
        'fa-chevron-left'
    ];

    return (
        <i
            className = {classes.join(' ')}
            onClick={(e) => props.onBack(e)}
        />
    );
}

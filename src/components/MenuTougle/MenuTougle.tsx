import React from 'react';
import './MenuTougle.css';
import { IMenuTougleProps } from '../../interfaces/IMenuTougleProps';

export const MenuTougle = (props: IMenuTougleProps) => {
    const classes = [
        'MenuTougle',
        'fa',
        props.isOpen ? 'fa-times open' : 'fa-bars' // 'fa-chevron-left'
    ];

    return (
        <i
            className = {classes.join(' ')}
            onClick={(e) => props.onTougle(e)}
        />
    )
}

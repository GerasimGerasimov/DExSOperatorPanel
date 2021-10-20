import React from 'react';
import './ToolButton.css';
import { IToolButtonProps } from '../iToolButton';

export const ToolButton = (props: IToolButtonProps) => {
    const classes = [
        'MenuButton',
        'fa',
        ((Array.isArray(props.icon))? props.icon[0]: props.icon),
        'pressed'
    ]

    return (
        <i  title = {props.name}
            className = {classes.join(' ')}
            onClick={()=>props.onClick(props.name, false)}
        ></i>
    )
}
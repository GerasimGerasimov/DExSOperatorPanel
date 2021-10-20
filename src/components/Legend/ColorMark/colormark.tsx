import React from 'react';
import './colormark.css';

export interface IColorMarkProps {
    color: string;
}

export const ColorMark = (props: IColorMarkProps) => {

    return (
        <div 
          className = {'ColorMark'}
          style= {{backgroundColor: props.color}}
        ></div>
    )
}
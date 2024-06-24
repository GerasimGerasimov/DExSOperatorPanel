import React from 'react';
import './ColorMark.css';
import { IColorMarkProps } from '../../../interfaces/IColorMarkProps';

export const ColorMark = (props: IColorMarkProps) => {
  return (
      <div
        className = {'ColorMark'}
        style={{ backgroundColor: props.color }}
      />
  )
}

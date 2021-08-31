import React from "react";
import { EEventTypes } from "../../../event-log-reader/event-card/event-card-types";
import './event-icon.css';

export function getEventIconsByType(type: string): JSX.Element {
  const icons: {[index: string]: any} = {
    [EEventTypes.ALARM]: getIconAlarm,
    [EEventTypes.WARNING]: getIconWarning,
    [EEventTypes.INFO]: getIconInfo,
    'defaulf': getIconDefault
  }
  return (icons[type] || icons['default'])()
}

function getIconDefault(): JSX.Element{
  console.log(`getEventIconsByType: type not found`);
  return (
    <p>?</p>
  )
}

function getIconAlarm(): JSX.Element{
  return (
    <svg className='_svg' viewBox="0 0 1 1">
      <g transform='translate(0.05, 0.05) scale(0.95)'>
        <path d="M 0 0.5 L 0.5 0 L 1 0.5 L 0.5 1 Z"
          fill="red" />
      </g>
    </svg>
  )
}

function getIconWarning(): JSX.Element{
  return (
    <svg className='_svg' viewBox="0 0 1 1">
      <g transform='translate(0.05, 0.05) scale(0.95)'>
        <rect x='0' y='0' width='1' height='1'
          fill="#ffba00"/>
      </g>
    </svg>
  )
}

function getIconInfo(): JSX.Element{
  return (
    <svg className='_svg' viewBox="0 0 1 1">
      <g transform='translate(0.05, 0.05) scale(0.95)'>
        <path d="M 0 1 L 0.5 0 L 1 1 Z"
          fill="#8000C0"/>
      </g>
    </svg>
  )
}
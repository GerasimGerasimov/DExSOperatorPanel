import React from "react";
import './hw.css';

export default function HelloWording(props: any) {
    return (<h1 className="HelloWording">Hello word, {props.name}</h1>)
}
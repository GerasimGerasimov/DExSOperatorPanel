import React from "react";
import './Clock.css';

interface IClockState {
    date: string;
    isTougle: boolean;
};
            
interface IClockProps {
    name: string;
};

export default class Clock extends React.Component<IClockProps, IClockState> {

    public readonly state: Readonly<IClockState> = {
        date: new Date().toISOString(),
        isTougle: false
    };

    private timerID: any = undefined;

    constructor (props: any) {
        super(props);
        // Эта привязка обязательна для работы `this` в колбэке.
        // this.tougleBtnState = this.tougleBtnState.bind(this);
        // или делать так
        // private tougleBtnState = () =>{
    };

    render () {
        return (
            <div>
                <h3>{`${this.props.name}:`} {this.state.date}</h3>
                <button onClick = {this.tougleBtnState}>{this.state.isTougle ? 'Включено':'Отключено'}</button>
            </div>
        );
    };

    private tougleBtnState = () =>{
        this.setState({isTougle:!this.state.isTougle})
    }

    private tick() {
        this.setState({date: new Date().toISOString()})
    }

    componentDidMount() {
        console.log('componentDidMount');
        this.timerID = setInterval(()=> this.tick(), 1000);
    }
  
    componentWillUnmount() {
        console.log('componentWillMount');
        if (this.timerID) clearInterval(this.timerID);
    }
}
import { IEventFunction } from "../../../../../lib/util/misctypes";

export interface IKeyBoardProps {
    onClick: IEventFunction;
    data: {
        name: string;
        value: string;
        comment: string;
        msu: string;
    }
}

export interface IValueFunction {
    (value: any): void;
}

export interface IKeyBoardButtonProps {
    onClick: IValueFunction;
    position: string;
    value: string;
}
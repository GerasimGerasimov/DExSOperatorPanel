export interface IEventFunction {
    (event: any): void;
}

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
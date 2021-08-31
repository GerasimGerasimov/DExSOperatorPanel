export type voidCallback = () => void;

export interface IErrorMessage {
    status: string,
    msg: any
}

export interface ICmdToServer {
    cmd:Array<number>,
    payload: any
}

export function validationJSON (data: any): any | IErrorMessage {
    try {
        return JSON.parse(data);
    } catch (e) {
        return {status: 'Error', msg: 'Invalid JSON'} as IErrorMessage;
    }
}

export function ErrorMessage(msg: string): IErrorMessage {
    const ErrorMsg: IErrorMessage = {status: 'Error', msg};
    return ErrorMsg;
}
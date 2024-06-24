class TAppError {
    message: string = '';
    name: string = '';
    stack?: any
    value?: any;
  }

export function RowCountError (message: string): TAppError {
    return {
        message,
        name: 'RowCountError',
        value: undefined
    };
}

export function SuccessfullyValueFound (message: string, value: any): TAppError {
    return {
        message,
        value,
        name: 'SuccessfullyValueFound',
        stack: value.stack
    };
}

export function FailedSearchOfValue (message: string): TAppError {
    return {
        message,
        name: 'FailedSearchOfValue',
        value: undefined
    };
}

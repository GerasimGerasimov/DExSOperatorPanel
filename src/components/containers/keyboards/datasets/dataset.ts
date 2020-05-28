export class TParameter {
    name: string ='';
    value: string = '0';
    type: string = '';
    msu: string = '';
}

export const Parameters = {
    Iexc : {
        name: 'Iexc',
        value: 100,
        type: 'TFloat',
        msu: 'A'
    },
    Uexc : {
        name: 'Uexc',
        value: 5,
        type: 'TFloat',
        msu: 'V'
    },
    Toggle : {
        name: 'Toggle',
        value: 0,
        type: 'TBit',
        msu: ''
    },
    iSwitch : {
        name: 'iSwitch',
        value: 1,
        type: 'TBit',
        msu: ''
    }
}

export function getData(p: any): Map<string, TParameter> {
    const m: Map<string, TParameter> = new Map<string, TParameter>()
    for (let key in p) {
        const value: TParameter = {... p[key]};
        m.set(key, value)
    }
    return m;
}
export function gerArrFromIniString(ini: string): Array<string> {
    let res:Array<string>=[];
    let i = ini.indexOf('=');
    res.push(ini.slice(0,i));// pn
    const _ini:Array<string> = ini.slice(i+1).split(/[/]/);// получил массив
    _ini.splice(_ini.length-1,1);
    res = res.concat(_ini);
    return res;
}

export function loadLinesFromBuffer(buff:any): Array<string>{      
    return buff.toString().split("\n").
                    map((value: string): string => value.trim()).
                        filter(String);
}
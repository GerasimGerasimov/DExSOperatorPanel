export function getArrFromIniString(ini: string): Array<string> {
    let res:Array<string>=[];
    let i = ini.indexOf('=');
    res.push(ini.slice(0,i));// pn
    const _ini:Array<string> = ini.slice(i+1).split(/[/]/);// получил массив
    _ini.splice(_ini.length-1,1);
    res = res.concat(_ini);
    return res;
}

export function getObjectFromTagAndValue (Tag: string, value: string): any {
  const a: Array<string> = getArrFromDelimitedStr(Tag, '/');
  const [position, section, tag] = a;
  const res: Object = {[position]:{
    [section]:{
      [tag]:value
    }
  }}
  return res;
}

export function getArrFromDelimitedStr(s: string, delimiter: string = ' '): Array<string> {
  return s.slice().split(delimiter);
}

export function loadLinesFromBuffer(buff:any): Array<string>{      
    return buff.toString()
               .split("\n")
               .map((value: string): string => value.trim())
               .filter(String);
}

export function isEmpty(obj: Object): boolean {
  for (let key in obj) {
    // если тело цикла начнет выполняться - значит в объекте есть свойства
    return false;
  }
  return true;
}
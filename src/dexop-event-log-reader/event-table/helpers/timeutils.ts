export function isNowDate(date: string): boolean { //2021-02-28  YYYY-MM-DD
  return (date === toDateLocal(new Date()));
}

export function toDateLocal(date: Date): string {
  var res: string = '';
  const ten = (i:number) => (i < 10 ? '0' : '') + i;
  const d = {
    YYYY: date.getFullYear(),
    MM:   ten(date.getMonth() + 1),
    DD:   ten(date.getDate()),
  }
  res = `${d.YYYY}-${d.MM}-${d.DD}`
  return res;
}

export function toDateTimeLocal(date: Date): string {
  var
    ten = function (i:number) {
      return (i < 10 ? '0' : '') + i;
    },
    YYYY = date.getFullYear(),
    MM = ten(date.getMonth() + 1),
    DD = ten(date.getDate()),
    HH = ten(date.getHours()),
    II = ten(date.getMinutes()),
    SS = ten(date.getSeconds())
  ;
  return YYYY + '-' + MM + '-' + DD + 'T' +
           HH + ':' + II + ':' + SS;
};

export function getLocalDateTimeFormValue(value: number | undefined): string {
  const dateFrom = value || new Date();
  const date = new Date(dateFrom);
  return toDateTimeLocal(date);
}

export function getMinTimeFromRange(timeRange: Array<string>): string {
  return timeRange[0] || '--:--:--'
}

export function getMaxTimeFromRange(timeRange: Array<string>): string {
  return timeRange[timeRange.length - 1] || '--:--:--'
}
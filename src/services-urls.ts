const isDebug = true;
const DEBUG_HOST = ' http://192.168.1.100';
const HOST: string = (isDebug)
                    ? DEBUG_HOST
                    : `${window.location.protocol}//${window.location.hostname}`;
export const urlDevicesValuesGet: string = `${HOST}:5004/v1/devices/`;
export const urlDevicesValuesWrite: string = `${HOST}:5004/v1/values/`;
export const urlDevicesInfo: string = `${HOST}:5004/v1/info/`;
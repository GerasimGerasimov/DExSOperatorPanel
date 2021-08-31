const isDebug = true;
const DEBUG_HOST = '192.168.1.100';
const HOST: string = (isDebug)
                    ? DEBUG_HOST
                    : window.location.hostname;

/**TODO  если что то удалить http://  */
export const SERVICES_HOST = HOST;
export const urlDevicesValuesGet: string = `http://${HOST}:5004/v1/devices/`;
export const urlDevicesValuesWrite: string = `http://${HOST}:5004/v1/values/`;
export const urlDevicesInfo: string = `http://${HOST}:5004/v1/info/`;

//const url_even_host = HOST;
//export const url_event_logger_service = `ws://${url_even_host}:5007`;
//export const url_event_log_reader = `http://${url_even_host}:5008/`;
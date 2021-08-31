const isDebug = true;
const DEBUG_HOST = '192.168.1.100';
const HOST: string = (isDebug)
                    ? DEBUG_HOST
                    : window.location.hostname;

export const SERVICES_HOST = HOST;
export const urlDevicesValuesGet: string = `http://${SERVICES_HOST}:5004/v1/devices/`;
export const urlDevicesValuesWrite: string = `http://${SERVICES_HOST}:5004/v1/values/`;
export const urlDevicesInfo: string = `http://${SERVICES_HOST}:5004/v1/info/`;

export const url_event_logger_service = `ws://${SERVICES_HOST}:5007`;
export const url_event_log_reader = `http://${SERVICES_HOST}:5008/`;
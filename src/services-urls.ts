const isDebug = false;
const DEBUG_HOST = '192.168.1.100';
const HOST: string = (isDebug) ? DEBUG_HOST : window.location.hostname;

const TaggerPort: number = 5004;
const EventLoggerServicePort: number = 5007;
const EventLogReaderPort: number = 5008;
const DexopSystemServicesPort: number = 5011;
const UserServicePort: number = 5010;

const TaggerURL: string = `${HOST}:${TaggerPort}`;
const EventLoggerServiceURL: string = `${HOST}:${EventLoggerServicePort}`;
const EventLogReaderURL: string = `${HOST}:${EventLogReaderPort}`;
const DexopSystemServicesURL: string = `${HOST}:${DexopSystemServicesPort}`;
const UserServiceURL: string = `${HOST}:${UserServicePort}`;

export const urlTaggerService: string = `ws://${TaggerURL}`;
export const urlTaggerDevicesValuesGet: string = `http://${TaggerURL}/v1/devices/`;
export const urlTaggerDevicesValuesWrite: string = `http://${TaggerURL}/v1/values/`;
export const urlTaggerDevicesInfo: string = `http://${TaggerURL}/v1/info/`;

export const urlEventLoggerServiceSubscribe = `ws://${EventLoggerServiceURL}`;
export const urlEventLogReaderGet = `http://${EventLogReaderURL}/`;

export const urlDexopSystemServicesGetIP = `http://${DexopSystemServicesURL}/v1/IP/`;
export const urlDexopSystemServicesGetTime = `http://${DexopSystemServicesURL}/v1/time/`;

export const userServiceUrl: string = `http://${UserServiceURL}`;

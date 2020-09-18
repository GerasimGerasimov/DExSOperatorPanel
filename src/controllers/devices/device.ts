const HOST: string = `${window.location.protocol}//${window.location.hostname}`;
const urlDevicesValuesGet: string = `${HOST}:5004/v1/devices/`;
const urlDevicesValuesWrite: string = `${HOST}:5004/v1/values/`;
const urlDevicesInfo: string = `${HOST}:5004/v1/info/`;

export default class DeviceController {
    public static async  getData(request: object): Promise<any> {
        try {
            const header: any = {
                method: 'PUT',
                cache: 'no-cache',
                headers: {
                    'Content-Type':'application/json; charset=utf-8',
                },
                body:JSON.stringify(request)
            }
            return await fetch(urlDevicesValuesGet, header)
                .then (this.handledHTTPResponse)
                .then (this.validationJSON);
        } catch(e) {
            //console.log(e);
            throw new Error (`Fetch Error: ${e.message}`);
        }
    }


    public static async getDevicesInfo(): Promise<any> {
        try {
            const header: any = {
                method: 'GET',
                cache: 'no-cache',
                headers: {
                    'Content-Type':'application/json; charset=utf-8',
                }
            }
            return await fetch(urlDevicesInfo, header)
                .then (this.handledHTTPResponse)
                .then (this.validationJSON);
        } catch(e) {
            //console.log(e);
            throw new Error (`Fetch Error: ${e.message}`);
        }
    }

    public static async  writeValue(request: object): Promise<any> {
        try {
            const header: any = {
                method: 'PUT',
                cache: 'no-cache',
                mode: 'cors',
                headers: {
                    'Content-Type':'application/json; charset=utf-8',
                },
                body:JSON.stringify(request)
            }
            return await fetch(urlDevicesValuesWrite, header)
                .then (this.handledHTTPResponse)
                .then (this.validationJSON);
        } catch(e) {
            //console.log(e);
            throw new Error (`Fetch Error: ${e.message}`);
        }
    }

    private static handledHTTPResponse (response: any) {
        if (response.status === 404) throw new Error ('Url not found');
        return response.text();
    }

    private static validationJSON (data: any): any {
        try {
            const result = JSON.parse(data);
            return result.data;
        } catch (e) {
            throw new Error ('Invalid JSON');
        }
    }
}
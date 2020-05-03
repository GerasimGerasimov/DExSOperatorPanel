const urlDevicesValues: string = 'http://localhost:5004/v1/devices/';
const urlDevicesInfo: string = 'http://localhost:5004/v1/info/';

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
            return await fetch(urlDevicesValues, header)
                .then (this.handledHTTPResponse)
                .then (this.validationJSON);
        } catch(e) {
            console.log(e);
            throw new Error (`Fetch Error: ${e.message}`);
        }
    }


    public static async getDevicesInfo(): Promise<any> {
        try {
            const header: any = {
                method: 'PUT',
                cache: 'no-cache',
                headers: {
                    'Content-Type':'application/json; charset=utf-8',
                }
            }
            return await fetch(urlDevicesInfo, header)
                .then (this.handledHTTPResponse)
                .then (this.validationJSON);
        } catch(e) {
            console.log(e);
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
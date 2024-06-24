import { ISystemHostTime } from "../../interfaces/ISystemHostTime";
import { urlDexopSystemServicesGetIP, urlDexopSystemServicesGetTime } from "../../services-urls";

export default class SystemServicesController {
    public static async getIP (): Promise<any> {
        try {
            const header: any = {
                method: 'GET',
                cache: 'no-cache',
                headers: {
                    'Content-Type': 'application/json; charset=utf-8'
                }
            }
            return await fetch(urlDexopSystemServicesGetIP, header)
                .then(this.handledHTTPResponse)
                .then(this.validationJSON);
        } catch (e) {
            throw new Error(`Fetch Error: ${e}`);
        }
    }

    public static async getTime (): Promise<ISystemHostTime> {
      try {
          const header: any = {
              method: 'GET',
              cache: 'no-cache',
              headers: {
                  'Content-Type': 'application/json; charset=utf-8'
              }
          }
          return await fetch(urlDexopSystemServicesGetTime, header)
              .then(this.handledHTTPResponse)
              .then(this.validationJSON);
      } catch (e) {
          throw new Error(`Fetch Error: ${e}`);
      }
  }

    private static handledHTTPResponse (response: any) {
        if (response.status === 404) throw new Error('Url not found');
        return response.text();
    }

    private static validationJSON (data: any): any {
        try {
            const result = JSON.parse(data);
            return result.data;
        } catch (e) {
            throw new Error('Invalid JSON');
        }
    }
}

import { urlEventLogReaderGet } from "../../../services-urls";
import { TEventItems } from "../../event-models/events";

const eventLogReaderDates = `${urlEventLogReaderGet}v1/dates/`;
const eventLogReaderEvents = `${urlEventLogReaderGet}v1/events/`;

export class TEventReader {
  constructor () {
    console.log('TEventReader created');
  }

  public async getDates (): Promise<Array<string> | Error> {
      try {
        const header: any = {
            method: 'GET',
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            }
        }
        return await fetch(eventLogReaderDates, header)
            .then(this.handledHTTPResponse)
            .then(this.validationJSON);
      } catch (e) {
        throw new Error(`Fetch Error: ${e}`);
      }
  }

  public async getDateEvents (date: string): Promise<TEventItems> {
    const url: string = `${eventLogReaderEvents}${date}`;
    try {
      const header: any = {
          method: 'GET',
          cache: 'no-cache',
          headers: {
              'Content-Type': 'application/json; charset=utf-8'
          }
      }
      return await fetch(url, header)
          .then(this.handledHTTPResponse)
          .then(this.validationJSON);
    } catch (e) {
      throw new Error(`Fetch Error: ${e}`);
    }
  }

  private handledHTTPResponse (response: any) {
    if (response.status === 404) throw new Error('Url not found');
    return response.text();
  }

  private validationJSON (data: any): any {
    try {
      const result = JSON.parse(data);
      return result;
    } catch (e) {
        throw new Error('Invalid JSON');
    }
  }
}

export const EventReader:TEventReader = new TEventReader();

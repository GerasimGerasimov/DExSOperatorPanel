import { TEventItems } from "../../event-models/events";
import { url_event_log_reader } from "../../event-table/event-urls";

const event_log_reader_dates = `${url_event_log_reader}v1/dates/`;
const event_log_reader_events = `${url_event_log_reader}v1/events/`;

export class TEventReader {
  
  constructor(){
    console.log('TEventReader created');
  }

  public async getDates(): Promise<Array<string>  | Error > {
      try {
        const header: any = {
            method: 'GET',
            cache: 'no-cache',
            headers: {
                'Content-Type':'application/json; charset=utf-8',
            }
        }
        return await fetch(event_log_reader_dates, header)
            .then (this.handledHTTPResponse)
            .then (this.validationJSON);
      } catch(e) {
        throw new Error (`Fetch Error: ${e.message}`);
      }
  }

  public async getDateEvents(date: string): Promise<TEventItems> {
    const url: string = `${event_log_reader_events}${date}`;
    try {
      const header: any = {
          method: 'GET',
          cache: 'no-cache',
          headers: {
              'Content-Type':'application/json; charset=utf-8',
          }
      }
      return await fetch(url, header)
          .then (this.handledHTTPResponse)
          .then (this.validationJSON);
    } catch(e) {
      throw new Error (`Fetch Error: ${e.message}`);
    }
  }

  private handledHTTPResponse (response: any) {
    if (response.status === 404) throw new Error ('Url not found');
    return response.text();
  }

  private validationJSON (data: any): any {
    try {
      const result = JSON.parse(data);
      return result;
    } catch (e) {
        throw new Error ('Invalid JSON');
    }
  }

}

export const EventReader:TEventReader = new TEventReader();
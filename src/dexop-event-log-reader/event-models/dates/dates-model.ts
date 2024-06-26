import { IDateEventsCounters } from "../../../interfaces/IDateEventsCounters";
import { IEventServiceError } from "../../../interfaces/IEventServiceError";
import { IEventServiceRespond } from "../../../interfaces/IEventServiceRespond";
import { IOnChangeCallback } from "../../../interfaces/IOnChangeCallback";
import { urlEventLoggerServiceSubscribe } from "../../../services-urls";
import { EventReader } from "../../event-log-reader/controller/event-reader";
import { waitForValidRespond } from "../../utils";
import { WSInformer } from "../ws/client";

export class TDates {
  private dates: Map<string, IDateEventsCounters> = new Map();
  private LoadTryCount: number = 0;
  private onLoaded: IOnChangeCallback = (payload:Map<string, IDateEventsCounters>) => {};
  private onLoadError: IOnChangeCallback = (errorMsg: IEventServiceError) => { console.log(errorMsg) };
  private subscribers: Set<IOnChangeCallback> = new Set();
  private isLoaded: boolean = false;

  public init () {
    WSInformer.init(urlEventLoggerServiceSubscribe, this.onDBIsChangedAtNow.bind(this));
    this.waitForServiceRespond();
  }

  get isDataLoaded (): boolean {
    return this.isLoaded;
  }

  public pushData (data: string): boolean {
    if (this.dates.has(data)) {
      return false
    };
    this.dates.set(data, {
        events_counts_cash: new Map([['alarm', 0], ['warning', 0], ['info', 0]]),
        isLoaded: false
      });
    return true;
  }

  public set dataLoadedCallBack (func: IOnChangeCallback) {
    this.onLoaded = func;
  }

  public set dataLoadErrorCallBack (func: IOnChangeCallback) {
    this.onLoadError = func;
  }

  public set Subscribe (props: { func: IOnChangeCallback, from: string }) {
    console.log(`Subscribed from ${props.from}`);
    this.subscribers.add(props.func);
  }

  public unSubscribe (func: IOnChangeCallback, from: string) {
    console.log(`unSubscribed: ${from}`, this.subscribers.delete(func));
  }

  private notifySubscribers () {
    this.subscribers.forEach(func => {
      func('notifySubscribers')
    });
  }

  // "cmd":"dbchanged"
  private onDBIsChangedAtNow (msg: { cmd: string, payload: string }) {
    const cmd: string = msg.cmd || '';
    if (cmd === "dbchanged") {
      this.notifySubscribers();
    }
  }

  get Dates (): Map<string, IDateEventsCounters> {
    return this.dates;
  }

  private fillDates (respond: Array<string>): Map<string, IDateEventsCounters> {
    const res: Map<string, IDateEventsCounters> = new Map();

    respond.sort((a:any, b:any) => {
      a = new Date(a); b = new Date(b);
      return b - a;
    }).forEach(date => {
      const value: IDateEventsCounters = {
        events_counts_cash: new Map([['alarm', 0], ['warning', 0], ['info', 0]]),
        isLoaded: false
      }
      res.set(date, value);
    })
    return res;
  }

  private validateRespond (respond:{count: number, respond: any}): IEventServiceRespond {
    let msg: string = '';
    let dates: Array<string> = [];
    let valid: boolean = false;
      msg = ('msg' in respond.respond) ? respond.respond['msg'] : '';
      dates = (msg === '') ? respond.respond : [];
      valid = (msg === '');
      if (!valid) {
        throw new Error(`Error: event-reader: ${msg}`);
      }
      return { dates, valid }
  }

  private isValidRespond (respond: { count: number, respond: any }): IEventServiceRespond {
    const payload: IEventServiceRespond = this.validateRespond(respond);
    const resp: IEventServiceRespond = payload;
    return resp;
  }

  public async waitForServiceRespond () {
    this.isLoaded = false;
    const respond: Array<string> = await waitForValidRespond(
      this.loadDates.bind(this),
      this.isValidRespond.bind(this),
      this.sendErrorMsg.bind(this)
    ) as Array<string>;
    const dates: Array<string> = respond; // this.validateRespond(respond);
    this.dates = this.fillDates(dates);
    this.isLoaded = true;
    this.onLoaded({ dates: this.dates })
  }

  private sendErrorMsg (arg: { count: number, error: string }): void {
    this.onLoadError(arg);
  }

  private async loadDates (): Promise<Array<string>> {
    console.log(`Try to load Dates List: ${this.LoadTryCount++}`)
    try {
      return await EventReader.getDates() as Array<string>;
    } catch (e) {
      throw new Error(`Error: event-reader not respond: ${e}`);
    }
  }
}

export const ModelDates = new TDates();

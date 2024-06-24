import { IErrorMessage } from '../../../../interfaces/IErrorMessage';
import { IServiceRespond } from '../../../../interfaces/IServiceRespond';
import { ErrorMessage, validationJSON } from '../../../../lib/util/errors';
import { TMessage } from '../types';

import WSControl from './wscontroller'

export default class HostController {
    private host: string;
    private wss: WSControl | null = null;
    private ClientID: string = '';

    constructor ({ host }: { host: string }) {
      this.host = host;
    }

    public async open () {
        this.ClientID = ''
        this.wss = null;
        this.wss = new WSControl({
            host: this.host,
            handler: this.validateIncomingMessage.bind(this)
        });
        this.ClientID = await this.waitForID();
        console.log(this.ClientID);
    }

    private async waitForID (): Promise<string> {
      const respond: any = await this.wss!.open();
      const msg: any = this.validateIncomingMessage(respond);
      const data: any = this.decodeCommand(msg);
      return data;
    }

    public async close () {
      await this.wss!.close(); // const res: string = await this.wss!.close();
      console.log(`Connection ${this.ClientID} has been closed`);
      this.wss = null;
      this.ClientID = '';
    }

    public validateIncomingMessage (respond: any): IServiceRespond | IErrorMessage {
        const msg: any = validationJSON(respond);
        return msg;
    }

    private validateDataMsg (respond: any): any | IErrorMessage {
        if ('status' in respond) {
            if (respond.status === 'OK') {
                if ('data' in respond) {
                    return respond.data;
                }
            }
        }
        throw new Error(`Incorrect respond ${respond}`);
    }

    private decodeCommand (msg: TMessage): any {
        const key = msg.cmd;
        const commands: {[index: string]: any} = {
            'id': this.setClientID.bind(this),
            'getInfo': this.handleGetMessage.bind(this),
            'getValues': this.handleGetMessage.bind(this),
            'default': () => {
                return ErrorMessage('Unknown command');
            }
        };
        return (commands[key] || commands['default'])(msg);
    }

    private setClientID (msg: TMessage): string {
      return msg.payload;
    }

    private handleGetMessage (msg: TMessage): Promise<any | IErrorMessage> {
        return msg.payload;
    }

    public async getInfo (): Promise<any | IErrorMessage> {
        try {
            const payload = {
                cmd: 'getInfo',
                ClientID: this.ClientID
            }
            const respond: any = await this.waitForMessage(payload);
            const validRespond: any = this.validateDataMsg(respond);
            return validRespond;
        } catch (e) {
            console.log(e);
            throw new Error(`Fetch Error: ${e}`);
        }
    }

    public async getValues (request: any): Promise<any | IErrorMessage> {
        const payload = {
            cmd: 'getValues',
            ClientID: this.ClientID,
            payload: request
        }
        const respond: any = await this.waitForMessage(payload);
        this.handleStatusField(respond);
        this.handleErrorStatus(respond);
        const validRespond: any = this.validateDataMsg(respond);
        return validRespond;
    }

    private handleStatusField (respond: any): void {
        if (!respond.status) throw new Error('Status field does not exist');
    }

    private handleErrorStatus (respond: any): void {
        if (respond.status === 'Error') throw new Error(respond.msg);
    }

    private async waitForMessage (request: any): Promise<string> {
        const respond: string = await this.wss!.send(request);
        const msg: any = this.validateIncomingMessage(respond);
        const data: any = this.decodeCommand(msg);
        return data;
    }
}

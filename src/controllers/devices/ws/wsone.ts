import { randomStringAsBase64Url } from '../../../lib/util/cryputils';
import { ErrorMessage, validationJSON } from '../../../lib/util/errors';

import { TMessage, TRespond, TTask } from './types';

export class TSocketParameters {
    ws: WebSocket | null = null;
    onCloseAction: Function = ()=>{};
    onGetData: Function = ()=>{};
}

export class Socket {
    private ws: WebSocket | null;
    //public  commands: Set<TTask>;
    public ID: string = '';
    private onCloseAction: Function;
    private onGetData: Function;

    constructor (arg: TSocketParameters){
        this.ws = arg.ws;
        this.ID = randomStringAsBase64Url(4);
        this.onCloseAction = arg.onCloseAction;
        this.onGetData = arg.onGetData;
        this.ws!.onmessage = this.onMessage.bind(this);
        this.ws!.onclose   = this.onClose.bind(this);
    }

    public async send (message: any) {
        await this.waitBufferRelease();
        this.ws!.send(JSON.stringify(message));
    }

    private async onMessage(message: any) {
        try {
            const request = validationJSON(message);
            this.decodeCommand(request);
        } catch (e) {
            this.send(ErrorMessage(e.message || ''));
        }
    }

    private onClose(){
        console.log('Connection close');
        this.onCloseAction(this.ID);
    }

    private decodeCommand(msg: TMessage){
        const key = msg.cmd;
        const commands:{[index:string]: any} = {
            'get'    : this.getData.bind(this),
            'default': () => {
                return ErrorMessage('Unknown command');
            }
        };
        (commands[key] || commands['default'])(msg)
    }

    private getData(msg: TMessage) {
        var payload: any = {}
        if (this.onGetData) {
            payload = this.onGetData(msg.payload);
        }
        const respond: TRespond  = {
            MessageID: msg.MessageID,
            cmd: 'get',
            payload
        };
        console.log(`send: ${this.ID} msg: ${msg.MessageID} time ${new Date().getTime()}`)
        this.send(respond);
    }  

    //чтени сокета в режиме запрос-ожидание ответа- ответ
    public async waitBufferRelease(): Promise<any> {
        return new Promise((resolve, reject) => {
            var timeOutTimer: any = undefined;
            var chekBufferTimer: any = undefined;
            if (this.ws!.bufferedAmount === 0)
                return resolve('OK, buffer is empty'); //буфер чист
            //ошибка, если буфер не очистился за 1 сек 
            timeOutTimer = setTimeout( () => {
                clearTimeout(timeOutTimer);
                clearInterval(chekBufferTimer);
                reject(new Error ('Time out, buffer does not empty'))
            }, 1000);
            //постоянная проверка буфера на очистку
            chekBufferTimer = setInterval( () => {
                if (this.ws!.bufferedAmount === 0) {
                    clearTimeout(timeOutTimer);
                    clearInterval(chekBufferTimer);
                    return resolve('OK, buffer is empty'); //буфер чист
                }
            }, 1);
        });
    }

}

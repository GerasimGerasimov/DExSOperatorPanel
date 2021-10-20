interface handler {
    ({}): any;
}

export default class WSControl {

    private host: string;
    private ws:WebSocket;

    private onIncomingMessage: handler;
    private onOpenConnection:  handler = ()=>{};
    private onCloseConnection:  handler = ()=>{};

    constructor (host: string, handler: handler){
        this.host = host;
        this.onIncomingMessage = handler;
        this.ws = new WebSocket(this.host);
        this.initSocket();
    }

    public set IncomingMessageCallBack(func: handler) {
        this.onIncomingMessage = func;
    }

    public set OpenConnectionCallBack(func: handler) {
        this.onOpenConnection = func;
    }

    public set CloseConnectionCallBack(func: handler) {
        this.onCloseConnection = func;
    }

    public async send(payload: any){
        await this.waitBufferRelease();
        this.ws.send(JSON.stringify(payload));
    }

    private async waitBufferRelease(): Promise<any> {
        return new Promise((resolve, reject) => {
            var timeOutTimer: any = undefined;
            var chekBufferTimer: any = undefined;
            if (this.ws.bufferedAmount === 0)
                return resolve('OK, buffer is empty'); //буфер чист
            //ошибка, если буфер не очистился за 1 сек 
            timeOutTimer = setTimeout( () => {
                clearTimeout(timeOutTimer);
                clearInterval(chekBufferTimer);
                reject(new Error ('Time out, buffer does not empty'))
            }, 1000);
            //постоянная проверка буфера на очистку
            chekBufferTimer = setInterval( () => {
                if (this.ws.bufferedAmount === 0) {
                    clearTimeout(timeOutTimer);
                    clearInterval(chekBufferTimer);
                    return resolve('OK, buffer is empty'); //буфер чист
                }
            }, 1);
        });
    }

    // Инициализация сокета и восстановление связи
    private initSocket() {
        this.ws.onerror = this.onError.bind(this);
        this.ws.onopen = this.onOpen.bind(this);
        this.ws.onclose = this.onClose.bind(this);
        this.ws.onmessage = this.onMessage.bind(this);
    }

    private onOpen(event: any) {
        console.log(`Opened connection to ${this.host}`);
        this.onOpenConnection({});
    }    

    private onError(event: any) {
        console.log(`Error of connection to ${this.host} ${event}`);
    }

    private onClose(event: any) {
        console.log(`Closed connection to ${this.host}`);
        this.onOpenConnection({});
        setTimeout(async () => {
            console.log(`Try connect to ${this.host}`);
            this.ws = null!;
            this.ws = new WebSocket(this.host);
            this.initSocket();
        }, 1000);
    }

    private onMessage(msg: any) {
        this.onIncomingMessage(msg.data);
    }

}
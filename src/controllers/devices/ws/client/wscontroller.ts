interface handler {({}): any;}

class SendError extends Error {
    constructor(message: any) {
      super(message); // (1)
      this.name = "SendError"; // (2)
    }
  }

export default class WSControl {

    private host: string;
    private ws:WebSocket | null = null;
    private hostState: boolean = false;

    constructor ({ host, handler }: { host: string; handler: handler; }){
        this.host = host;
    }

    public async close(): Promise<string> {
      if (this.ws !== null) {
        this.ws.close();
        if (this.isConnected()) {
            await this.waitForEvent();
        }
        this.ws = null;
      }
      return 'Connection has closed already';
    }

    public async send(payload: any): Promise<string>{
      try {
        this.ws!.send(JSON.stringify(payload));
        const res: string = await this.waitForEvent();
        return res;
      } catch (e) {
          throw new SendError ('Connection has closed already');
      }
    }

    public async waitForEvent(): Promise<any> {
        return new Promise((resolve, reject)=>{
            this.ws!.onopen = (event) => {
                console.log(`Opened connection to ${this.host}`);
                this.hostState = true;
            };
            this.ws!.onclose = (event) => {
                this.hostState = false;
                this.ws = null;
                console.log(`Closed connection to ${this.host}`);
                resolve(`Closed connection to ${this.host}`);
            };
            this.ws!.onmessage = (message) => {
                resolve(message.data);
            };
            this.ws!.onerror = (event) => {
                console.log(`Error of connection to ${this.host} ${event}`);
                reject(`Error of connection to ${this.host} ${event}`);
            };
        }
        )
    }
    // Инициализация сокета и восстановление связи
    public async open(): Promise<any> {
        this.ws = new WebSocket(this.host);
        return await this.waitForEvent();
    }

    private isConnected(): boolean {
        return this.hostState;
    }

    //чтени сокета в режиме запрос-ожидание ответа- ответ
    private async waitBufferRelease(): Promise<any> {
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
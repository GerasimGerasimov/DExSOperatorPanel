import { IEventServiceRespond } from "./event-models/dates/dates-types";

export async function delay(ms: number): Promise<any> {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, ms);
  });
}

export async function * asyncGenerator <T> (func: (value?:T) => Promise<void | T>) {
  let count = 0;
  while (true) {
    count ++;
    try {
      const respond = await func();
      yield {count, respond, error:''};
      break;
    } catch (e) {
      yield {count, respond: undefined, error: e.message};
    }
  }
}

export async function waitForUnErrorExecution <T> (func: (value?:T) => Promise<void | T>): Promise<void | T> {
  for await (let {count, respond, error} of asyncGenerator(func)) {
    console.log(count, respond, error);//сюда попадаю когда данные прочитаны
    if (respond) {
      return respond;
    }
    await delay(1000);
  }
}

export async function * asyncValidGenerator <T> (func: (value?:T) => Promise<void | T>,
                                                   validate:(data:any) => IEventServiceRespond
) {
  let count = 0;
  while (true) {
    count ++;
    try {
      const respond = await func();
      const result: IEventServiceRespond = validate({count, respond})
      if (result.valid) {
        yield {count, respond:result.dates, error:''};
        break;
      }
    } catch (e) {
      yield {count, respond: undefined, error: e.message};
    }
  }
}

export async function waitForValidRespond <T> (func: (value?:T) => Promise<void | T>,
                                                isValid:(res:{count: number, respond: any})=>IEventServiceRespond,
                                                  errCb:(arg:{count: number, error: string}) => void)
                                                  : Promise<void | T>
{
  for await (let {count, respond, error} of asyncValidGenerator(func, isValid)) {
    console.log(count, respond, error);//сюда попадаю когда данные прочитаны и валидны
    if (respond !== undefined) {
      return respond as any;
    }
    if (error !== '') {
      errCb({count, error})
    }
    await delay(1000);
  }
}
import {getObjectURL} from './utils'

export class TSvgContents {
    public aContents: Map<string, any> = new Map();//массив картинок с их ObjectURL

    get Contents(){
        return this.aContents;
    }

    public getLoadedImg(key: string) {
        return this.aContents.get(key);
    }

    public async getImg (key: string, path: string = '') {//key-название картинки, path-имя файла с путём до неё
        var content: any = this.aContents.get(key);
        if (content !== undefined) {
          return content;
        } else {
            content = await getObjectURL(path);
            if (content!== undefined) {
                this.aContents.set(key, content);//вставляю в хранилище
                return content;
            }
        }
    }

}

import { TSVGComponent, TSVGComponentArg } from './TSVGComponent';
import { TSVGComponentInitialArgs } from './svgCompFactory';

// компоненты на структурной схеме
const DEFAULT_TEXT_VALUE: Array<string> = ['.---', '-.--', '--.-', '---.']

export default class TText extends TSVGComponent {
    private value: string = '';
    private fraction:number = 0;
    private defaultPosition: number = 0;
    private predState: string = '';

    constructor (args: TSVGComponentInitialArgs) {
        super(args);
        this.fraction = Number(args.fraction) || 0;
    }

    public setState (arg:TSVGComponentArg): boolean {
        let [value, msu] = arg.value.split(' ');
        value = value.trim() || '';
        msu = msu ? ` ${msu}` : '';
        this.value = (value) ? `${Number(value).toFixed(this.fraction)}${msu}` : DEFAULT_TEXT_VALUE[this.defaultPosition++ & 3];
        // this.checkChanges()
        return true;
    }

    private checkChanges (): boolean {
        const res: boolean = (this.value === this.predState);
        this.predState = this.value;
        return res;
    }

	// Отрисовка компонента в контейнере(если состояние изменилось)
    public async draw () {
        this.SVGconteiner.innerHTML = this.value;
    }
}

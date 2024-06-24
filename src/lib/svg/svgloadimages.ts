import { TSvgContents } from "./lib/svgcontent";

export const svgContents = new TSvgContents();

export async function loadSVGImages () {
    // загрузить SVG-шки выключателя
    await svgContents.getImg({ key: 'empty', path: '/assets/svg/empty.svg' });
    await svgContents.getImg({ key: 'switchOn', path: '/assets/svg/switchOn.svg' });
    await svgContents.getImg({ key: 'switchOff', path: '/assets/svg/switchOff.svg' });
};

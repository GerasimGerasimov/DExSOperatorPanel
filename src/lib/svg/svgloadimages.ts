import { TSvgContents } from "./lib/svgcontent";

export const svgContents = new TSvgContents();

export async function loadSVGImages() {
    //загрузить SVG-шки выключателя
    await svgContents.getImg('switchNoLink', '/assets/svg/switchNoLink.svg');    
    await svgContents.getImg('switchOn'   ,  '/assets/svg/switchOn.svg');
    await svgContents.getImg('switchOff'  ,  '/assets/svg/switchOff.svg');
};
import { TSvgContents } from "./lib/svgcontent";

export const svgContents = new TSvgContents();

export function loadSVGImages() {
    //загрузить SVG-шки выключателя
    svgContents.getImg('switchOn'   ,  '/assets/svg/switchOn.svg');
    svgContents.getImg('switchOff'  ,  '/assets/svg/switchOff.svg');
    svgContents.getImg('switchNoLink', '/assets/svg/switchNoLink.svg');
};
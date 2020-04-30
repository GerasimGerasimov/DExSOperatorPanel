//https://stackoverrun.com/ru/q/11548996
import React, {Component} from 'react'

class TPageContent {
  name:string = '';
  title: string = '';
  parameters: Array<string> = [];
}

export default class DevicesRouter extends Component {

  private PagesMap: Map<string, TPageContent>;

  constructor (props: any){
    super(props)
    const {location} = props
    const {pathname} = location
    const {devname} = props.match.params;
    console.log('DevicesRouter', devname)
    this.PagesMap = new Map<string, TPageContent>();
    const listItems:Array<string> = this.loadLinesFromBuffer(DEVICE_PAGES);
    this.parsePagesArrayToMap(listItems);
    const Items = Array.from(this.PagesMap, (item: any) => item[1].title);
    console.log(Items);
  }

  private gerArrFromIniString(ini: string): Array<string> {
    let res:Array<string>=[];
    let i = ini.indexOf('=');
    res.push(ini.slice(0,i));// pn
    const _ini:Array<string> = ini.slice(i+1).split(/[/]/);// получил массив
    _ini.splice(_ini.length-1,1);
    res = res.concat(_ini);
    return res;
  }

  private getPageContent(iniStr:string): TPageContent {
    const args:Array<string> = this.gerArrFromIniString(iniStr)
    const res: TPageContent = new TPageContent();
    res.name = args[0];
    res.title = args[1];
    //TODO распарсить в списки RAM/FLASH/CD
    //превратить в теги U1>U1:RAM>data>Iexc
    //res.parameters = argStr[2];
    return res;
  }

  private parsePagesArrayToMap(PagesArray: Array<string>) {
    PagesArray.forEach((item: string) => { 
        if (item[0] !== ';') {//если не комментарий
            let page = this.getPageContent(item);// получаю объект параметра
                let key: string = page.name;//до добавляю в карту
                this.PagesMap.set(key, page);
            }
    })
  }

  private loadLinesFromBuffer(buff:any): Array<string>{      
    return buff.toString().split("\n").
                    map((value: string): string => value.trim()).
                        filter(String);
  }

  render() {
    const listItems = Array.from(this.PagesMap.values(), (item: TPageContent) =>
      <li key={item.name}>{item.title}</li>
    );

    return(
      <>
        <h1>Settings</h1>
        <div className="text-left">
          <ul>{listItems}</ul>
        </div>
      </>
    )
  }
}

const DEVICE_PAGES: string = 
`p0=Самовозбуждение/FLASH:SelfExciteEnable,FLASH:Ready_GS_ON/
p1=Задания автоматического режима/RAM:Usgz,RAM:Stz,RAM:UstStC,RAM:Ustat,FLASH:zUs,FLASH:zSt/
p2=Выходные параметры/RAM:Iexc,RAM:Ustat,RAM:Istat,RAM:Fi,RAM:Ssg,RAM:Psg,RAM:Qsg,RAM:Freq,RAM:Usg_ab/
p3=Готовность/RAM:iReady,RAM:iPCSB_QF1,RAM:iCCSB_QF5,RAM:DExS_PWR_OK,RAM:iSwState,RAM:FAULT,RAM:TestMode/
p4=Аварии/RAM:GlobalError,RAM:FieldFail,RAM:UstMaxFlt,RAM:NotUpVoltage,RAM:IttMaxFlt,RAM:IexcMaxFlt,RAM:FltMPS,RAM:FltCCSB,RAM:FSAsyncRun,RAM:QminAsyncRun,RAM:FLongForce,RAM:FreqMinFlt,RAM:R_INSL_FLT,RAM:IstOV/
p5=Предупреждения/RAM:R_INSL_LOW,RAM:UstLow,RAM:UstFail,RAM:i2tR,RAM:UstMaxFlt/
p6=Дискретные входы/RAM:iReady,RAM:iTest,RAM:iReset,RAM:iSwState,RAM:iIRp+,RAM:iAuto,RAM:iEnergize,RAM:iBlanking,RAM:iSGFault,RAM:iPCSB_QF1,RAM:iCCSB_QF5,RAM:iLocalMode/
p7=Дискретные выходы/RAM:oREADY_K2,RAM:oExcite_K5,RAM:oComplete_K6,RAM:oWARNING_K3,RAM:oFAULT_K4,RAM:oINSLFlt_K7,RAM:oCROWBAR_K1,RAM:oReserve_K8/
p8=Преобразователь/RAM:Iexc,RAM:Uexc,RAM:A,RAM:Uab_sync,RAM:Ubc_sync,RAM:Uca_sync,RAM:IttA,RAM:IttB,RAM:IttC/
p9=Реактивная мощность/RAM:Qsg,RAM:Qoe,RAM:QLimMin,RAM:QLimMax/
p10=Ограничители.Ток возбуждения/RAM:Iexc,RAM:IexcLimMax,RAM:IexcLimMin,FLASH:fIexcMin,FLASH:fIexcMax,FLASH:fIexcForce,FLASH:Iref_i2t_R_limit,FLASH:i2tOV_OFF_R,FLASH:i2tOV_ON_R,FLASH:Ti2tR/
p11=Ограничители.Напряжение/RAM:Ustat,RAM:Usgz,RAM:UstStC,FLASH:UstLmax,FLASH:UstLmin/
p12=Ограничители.Реактивная мощность/RAM:Qsg,RAM:Qoe,RAM:QLimMin,RAM:QLimMax,FLASH:Pnom,FLASH:QminP0,FLASH:QminP1,FLASH:QmaxP0,FLASH:QmaxP1,FLASH:dQmin,FLASH:QminAsyncTime/
p13=Начальное возбуждение/FLASH:IexcTest,FLASH:fIexcStart,FLASH:dIz,FLASH:zUs,FLASH:UstNom,FLASH:UstStart,FLASH:FltUpVoltageTime/
p14=Контроль напряжения статора/RAM:Ustat,RAM:UstLow,RAM:UstFail,FLASH:UstNom,FLASH:UstLowReset,FLASH:UstLowSet,FLASH:UstFailReset,FLASH:UstFailSet/
p15=Коэффициенты регулятора/FLASH:KUst,FLASH:KIexc,FLASH:Ti,CD:TfUstat,CD:TfIload,CD:TfFi/
p16=Изоляция/RAM:RINSL,RAM:R_INSL_LOW,RAM:R_INSL_FLT,FLASH:RInslLow,FLASH:RInslFlt,FLASH:RInslUp,FLASH:RInslFltEnable/
`
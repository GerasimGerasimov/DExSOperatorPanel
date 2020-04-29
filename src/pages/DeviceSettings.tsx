import React, {Component} from 'react'
import {inject, observer} from 'mobx-react'
import {observable, autorun} from 'mobx'
import {deviceStore, TDeviceStore} from '../store/devices/devices'

@observer
export default class DeviceSettings extends Component {

  constructor (props: any){
    super(props)
  }

  render() {
    return(
      <>
        <h1>Settings</h1>
        <button type="button" className="btn btn-primary ml-1">
          <span className="badge badge-light bg-success">
          </span>
          <span className="badge badge-light bg-warning ml-1">
            {deviceStore.count}
          </span>
        </button>
      </>
    )
  }
}

/*
[PAGES]
p0=Самовозбуждение/FLASH:SelfExciteEnable,FLASH:Ready_GS_ON/
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

*/
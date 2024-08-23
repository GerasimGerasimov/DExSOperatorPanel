import React, { Component } from 'react';
import { TParameter, getTags } from '../../lib/devicepagecontent/devicepagecontent';
import { observer } from 'mobx-react';
import { autorun, extendObservable } from 'mobx';
import { devicesInfoStore } from '../../store/devices/devicesinfo';
import KeyBoard from '../../components/containers/keyboards/UI/KeyBoards/KeyBoard';
import Modal from '../../components/HOC/Modal/Modal';
import { getTableClickRowCol, getParameterByRow } from '../../components/containers/keyboards/helpers/tables';
import DeviceController from '../../controllers/devices/http/device';
import { getObjectFromTagAndValue } from '../../lib/util/commonmisc';

interface IState {
  showModal: boolean;
  parameters: Map<string, TParameter>;
  keyBoard: string;
}

interface IInputResult {
  cause: string;
  value: string;
}

@observer
export default class DeviceParameters extends Component<{}, IState> {
  private parameters = new Map<string, TParameter>();
  private position: string = '';
  private handlers: Array<any> = [];
  private selected = {
    name: '',
    value: '',
    comment: '',
    msu: '',
    tag: ''
  }

  constructor (props: any) {
    super(props)
    this.state = {
      showModal: false,
      parameters: new Map<string, TParameter>(),
      keyBoard: 'KeyBoardNumeric'
  };
    const { position } = props.match.params || '';
    this.position = position;
    const a: Array<TParameter> = props.location.state.deviceParameters || {};
    a.forEach((item:TParameter) => {
        const tag = `${this.position}/${item.section}/${item.name}`;
        item.tag = tag;
        this.parameters.set(tag, item);
        extendObservable(item, { value: '' })
    })
    this.createAutorunInitiatorValues();
  }

  private createAutorunInitiatorValues () {
    // запустить автообновление при изменении времени появления новой инфы
    const changes: Array<any> = devicesInfoStore.getObservableValues(
                                  getTags(this.position,
                                            Array.from(this.parameters.values())));
    this.handlers = changes.map(item => autorun(() => { this.update(item.time) }));
  }

  private getParameters (tagPath: string): {value: string, msu: string} {
    return devicesInfoStore.getTagProperties(tagPath, ['value', 'msu']);
  }

  private update (changed: any) {
    for (const [key, item] of this.parameters.entries()) {
      const { value } = this.getParameters(key);
      item.value = value;
    }
  }

  private getKeyBoardType (parameterType: string): string {
    switch (parameterType) {
      case 'TBit': {
        return 'KeyBoardBoolean';
      }
      case 'TFloat': {
        return "";
      }
      default: {
        return 'KeyBoardNumeric';
      }
    }
  }

  private handlerModalShow (event: any) {
    const { row /*, col */ } = getTableClickRowCol(event);
    const p: TParameter | undefined = getParameterByRow(this.parameters, row);
    if (p) {
      const { msu, comment, objType, value } = devicesInfoStore.getTagProperties(p.tag, ['msu', 'value', 'comment', 'objType']);
      const keyBoard = this.getKeyBoardType(objType);
      this.selected = {
        name: p.name,
        value,
        comment,
        msu,
        tag: p.tag
      }
      this.setState({
        showModal: true,
        keyBoard
      })
    }
  }

  async handlerModalClose (result: IInputResult) {
    const { cause, value } = result;
    if (cause === "ok") {
      const { tag } = this.selected;
      const req: any = getObjectFromTagAndValue(tag, value);
      console.log(this.selected);
      try {
        const data = await DeviceController.writeValue(req);
        console.log(data);
      } catch (e) {
        console.log(e);
      }
    }
    this.setState({
      showModal: false
    })
  }

  render () {
    const modal = this.state.showModal
      ? (
          <Modal classes='content-center'>
            <KeyBoard keyBoardType={this.state.keyBoard} data={this.selected} onClick={this.handlerModalClose.bind(this)}/>
          </Modal>
        )
      : null;

    return (
      <>
          <div className="table-responsive">
            <table className="table table-bordered table-condensed table-hover"
                >
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>M.U.</th>
                        <th>Value</th>
                    </tr>
                </thead>
                <tbody onClick = {(e) => this.handlerModalShow(e)}>
                  {
                    Array.from(this.parameters.entries(), ([key, item]) => {
                    const { msu } = devicesInfoStore.getTagProperties(key, ['value', 'msu']);
                      return (
                        <tr key={key}>
                          <td>{item.name}</td>
                          <td>{msu}</td>
                          <td >{item.value}</td>
                        </tr>
                      )
                    }
                  )}
                </tbody>
            </table>
          </div>
          {modal}
      </>
    )
  }
}

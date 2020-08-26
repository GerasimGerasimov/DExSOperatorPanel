import React from 'react'
import KeyBoardNumeric from './KeyBoardNumeric/KeyBoardNumeric';
import KeyBoardBoolean from './KeyBoardBoolean/KeyBoardBoolean';
import {IKeyBoardProps } from './IKeyBoards';

interface IKeyBoardsProps extends IKeyBoardProps {
    keyBoardType: string
}

export default class KeyBoard extends React.Component<IKeyBoardsProps,{}> {
  render() {
    const { keyBoardType, ...props } = this.props

    const KeyBoards: any = {
        KeyBoardBoolean,
        KeyBoardNumeric,
        'default': KeyBoardNumeric
    }

    const KeyBoard =  KeyBoards[keyBoardType] || KeyBoards['default'];

    return (
      React.createElement(KeyBoard, { ...props})
    )
  }
}

/*TODO клава должна корретно масштабироваться для девайса 320х240
  сейчас видно что у параметров длинными каментами,
  кнопки опускаются за пределы экрана,
  закрыть можно только клавишей ENTER, а её не будет! */
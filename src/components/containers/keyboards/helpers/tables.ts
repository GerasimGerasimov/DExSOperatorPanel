import { TParameter } from "../datasets/dataset";
import { RowCountError, SuccessfullyValueFound, FailedSearchOfValue } from "../errors/ErrorTableValueSearch";

export function getTableClickRowCol(event: any): {row: number, col: number} {
    let cell: any = event.target;
    if (cell.tagName.toLowerCase() !== 'td')
      return {row: 0, col: 0};
    let row = cell.parentNode.rowIndex;
    let col = cell.cellIndex;
    return {row, col};
  }

  export function getParameterByRow(parametersMap: Map<string, TParameter> ,row: number): TParameter | undefined {
    try {
      if (!row) throw RowCountError('Row number in not correct');
      let count: number = 1; 
      parametersMap.forEach((value: TParameter) => {
        if (count++ === row) {
          throw SuccessfullyValueFound('Element is found', value);
        }
      })
      throw FailedSearchOfValue('Element not found');
    } catch (e) {
        return e.value || undefined;
    }
  }
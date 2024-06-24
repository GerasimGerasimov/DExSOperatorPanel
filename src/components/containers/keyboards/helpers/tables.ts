import { RowCountError, SuccessfullyValueFound, FailedSearchOfValue } from "../errors/ErrorTableValueSearch";
import { TParameter } from "../../../../lib/devicepagecontent/devicepagecontent";

export function getTableClickRowCol (event: any): { row: number, col: number } {
    const cell: any = event.target;
    if (cell.tagName.toLowerCase() !== 'td') {
      return { row: 0, col: 0 };
    }
    const row = cell.parentNode.rowIndex;
    const col = cell.cellIndex;
    return { row, col };
  }

  export function getParameterByRow (parametersMap: Map<string, TParameter>, row: number): TParameter | undefined {
    try {
      if (!row) {
        throw RowCountError('Row number in not correct');
      }

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

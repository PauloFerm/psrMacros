export namespace InterfaceUtils {
  export function columnNumberToLetter(column: number): string {
    let temp, letter = '';
    while (column > 0) {
      temp = (column - 1) % 26;
      letter = String.fromCharCode(temp + 65) + letter;
      column = (column - temp - 1) / 26;
    }
    return letter;
  }

  /**
   * Range by name on active spreadsheet and throw exceptions
   * @param name - Range Name
   */
  export function rangeByName(name: string): GoogleAppsScript.Spreadsheet.Range {
    let ss = SpreadsheetApp.getActiveSpreadsheet();
    let range = ss.getRangeByName(name);

    if (range == null) {
      throw new Error(`Can't find range ${name}`);
    }

    return range;
  }

  export function isEmptyLine(array: any[]) {
    return array.filter(x => x == "" || x == null).length == array.length;
  }
}

export namespace LogUtils {
  function variableName(variable: any): string {
    return Object.keys({ variable })[0];
  }

  function checkNullVariable(value: any): boolean {

    let checkNaN = Number.isNaN(value);
    let checkNull = value == null;
    let checkUndefined = value == undefined;
    
    return (checkNaN || checkNull || checkUndefined);
  }

  export function checkVariables(variables: [string, any][]) {
    if (variables.map(array => checkNullVariable(array[1])).indexOf(true) > -1) {
      Logger.log(variables);
    }
  }
}

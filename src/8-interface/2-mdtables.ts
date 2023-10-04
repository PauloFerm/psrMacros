export namespace mdTables {
  type mdFlush = ' :--- ' | ' :---: ' | ' ---: ';
  type hAlign = 'general' | 'general-left' | 'general-right' | 'right' | 'left' | 'center';

  const mapAligment = (ali: string, index: number, values: string[]): mdFlush => {
    let mdAligment: mdFlush = ' :--- ';
    
    switch(ali) {
      case 'general': {
        let cellValue = values[index];
        mdAligment = isNaN(parseInt(cellValue)) ? ' :--- ': ' ---: ';
        break
      }
      case 'general-left': {
        mdAligment = ' :--- ';
        break;
      }
      case 'general-right': {
        mdAligment = ' ---: ';
        break;
      }
      case 'left': {
        mdAligment = ' :--- ';
        break;
      }
      case 'right': {
        mdAligment = ' ---: ';
        break;
      }
      case 'center': {
        mdAligment = ' :---: ';
        break;
      }
    }

    return mdAligment
  };

  const rowMD = (rowValues: string[]): string => {
    return `| ${rowValues.join(' | ')} |`
  };

  const numberOfDecimals = (numberFormated: string): number => {
    let dotPlace: number =  numberFormated.indexOf('.');

    return (dotPlace < 0) ? 0 : numberFormated.length - (dotPlace + 1);
  };

  const setDecimals = (value: string, decimals: number): string => {
    let asNumber = parseFloat(value);

    if (isNaN(asNumber)) {
      return value
    }

    let numberFormated = asNumber.toFixed(decimals)

    Logger.log([value, decimals, numberFormated]);

    return numberFormated
  }

  export const tableAsMarkdown = (): string => {
    const activeRange = SpreadsheetApp.getActiveRange();
    const activeValues = activeRange.getValues();

    const headerRowsValues = activeValues[0];
    const bodyRowsValues = activeValues.slice(1);
    
    const firstRowAligment = activeRange.getHorizontalAlignments()[1];
    const firstRowDecimals = activeRange.getNumberFormats()[1];

    const decimals = firstRowDecimals.map(format => numberOfDecimals(format));


    let mdAligment: mdFlush[] = firstRowAligment.map(
      (ali, i) => mapAligment(ali, i, bodyRowsValues[0])
    );

    let table: string[] = [
      rowMD(headerRowsValues),
      rowMD(mdAligment),
      ...bodyRowsValues.map(
        row => rowMD(row.map(
          (value, i) => setDecimals(value, decimals[i])
        ))
      )
    ];

    return table.join('\n')

  };
}
namespace mdTables {
  type mdFlush = ' :--- ' | ' :---: ' | ' ---: ';
  type hAlign = 'general' | 'general-left' | 'general-right' | 'right' | 'left' | 'center';

  const numberOfDecimals = (num: number): number => {
    let asString: string = num.toString();
    let dotPlace: number =  asString.indexOf('.');

    return (dotPlace < 0) ? 0 : asString.length - (dotPlace + 1);
  };

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

  export const tableAsMarkdown = (): string => {
    const activeRange = SpreadsheetApp.getActiveRange();
    const activeValues = activeRange.getValues();

    const headerRowsValues = activeValues[0];
    const bodyRowsValues = activeValues.slice(1);
    
    const firstRowAligment = activeRange.getHorizontalAlignments()[1];

    let mdAligment: mdFlush[] = firstRowAligment.map(
      (ali, i) => mapAligment(ali, i, bodyRowsValues[0])
    );

    const reduceDecimals = (value: string): string => {
      let asNumber = parseFloat(value);

      if (isNaN(asNumber) || numberOfDecimals(asNumber) < 2) {
        return value
      }

      return asNumber.toFixed(2)
    }

    let table: string[] = [
      rowMD(headerRowsValues),
      rowMD(mdAligment),
      ...bodyRowsValues.map(row => rowMD(
        row.map(value => reduceDecimals(value))
      ))
    ];

    return table.join('\n')

  };
}
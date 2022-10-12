namespace StatusBoard {
  interface property {
    name: string;
    value: string | number;
    symbol: string;
  }

  interface section {
    title: string;
    rows: property[];
  }

  interface board {
    title: string;
    sections: section[];
  }

  export function cropBoard(range: GoogleAppsScript.Spreadsheet.Range) {
    let values = range.getValues();
    
    let title: any = values[0][0];
    
    return title
  }
}

namespace DataBoard {

}

namespace CalcBoard {

}
namespace StatusBoard {
  interface property {
    name: string;
    value: string | number;
    symbol: string;
  }

  interface section {
    title: string;
    properties: property[];
  }

  interface board {
    title: string;
    sections: section[];
  }

  export function parseBoard(range: GoogleAppsScript.Spreadsheet.Range) {
    let values = range.getValues();
    
    let title: any = values[0][0];
    let sections: section[] = [];
    
    let subtitle: string = "NO DATA ASSIGNED";
    let properties: property[] = [];

    for (let i = 1; i < values.length; i++) {

      if (values[i][0] != "" && values[i][1] == "" && values[i][2] == "") {
        subtitle = values[i][0];
      } 
      else if (values[i][0] != "" && values[i][1] != "" && values[i][2] != "")  {
        properties.push({ 
          name: values[i][0], 
          value: values[i][1], 
          symbol: values[i][2] 
        })
      }
      else if (values[i][0] == "" && values[i][1] == "" && values[i][2] == "") {
        sections.push({ title: subtitle, properties: properties });

        subtitle = "NO DATA ASSIGNED";
        properties = [];
      }
      else {
        throw `Something weird happen on line ${values[i].join(", ")}`;
      }

    }

    // Last row doesn't trigger the empty row condition
    if (properties.length > 0) {
      sections.push({ title: subtitle, properties: properties })
    }
    
    let thisBoard = { title: title, sections: sections }

    return thisBoard
  }
}

namespace DataBoard {

}

namespace CalcBoard {

}
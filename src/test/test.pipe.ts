function test(description: string, action: any, value: any) {
  Logger.log(description, action == value);
}

function testPressures() {
  Logger.log(pprPressureLoss("PN20", 32, 0.4));
}

function testFormula() {
  let range = SpreadsheetApp.getActiveRange();

  let values = range.getValues();
  let formulas = range.getFormulas();

  Logger.log(values);
  Logger.log(formulas);
  Logger.log(formulas[0][0] == "")
}
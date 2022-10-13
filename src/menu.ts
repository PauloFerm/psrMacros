function onOpen() {
  let ui = SpreadsheetApp.getUi()
  ui.createMenu('PSR')
    .addSubMenu(ui.createMenu('Boards')
      .addItem('Parse Selected', 'parseBoard')
      .addItem('Validate Radiator', 'validateRadiator')
      .addItem('Update Radiator Data', 'updateRadiator'))
    .addToUi();

}

function parseBoard() {
  let sheet = SpreadsheetApp.getActiveSheet();
  let range = SpreadsheetApp.getActiveRange();

  let board = StatusBoard.parseBoard(range)

  SpreadsheetApp.getUi().alert(JSON.stringify(board));
}

function validateRadiator() {
  let range = SpreadsheetApp.getActiveRange();
  
  let radiatorList = Radiator.allModels();
  let rule = SpreadsheetApp.newDataValidation().requireValueInList(radiatorList).build();

  range.clearDataValidations();
  range.setDataValidation(rule);
}

function updateRadiator() {
  let range = SpreadsheetApp.getActiveRange();

  let values = range.getValues();

  if (values[0].length != 5) {
    throw "Number of columns must be 5";
  }

  for (let i = 0; i < values.length; i++) {
    let model = values[i][0];
    let radiator = Radiator.select(model);

    values[i][1] = radiator.power.kw;
    values[i][2] = radiator.power.kcalh;
    values[i][3] = radiator.flow;
    values[i][4] = radiator.price;

  }

  range.setValues(values);
}
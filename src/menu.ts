function onOpen() {
  let ui = SpreadsheetApp.getUi()
  ui.createMenu('PSR')
    .addSubMenu(ui.createMenu('Radiadores')
      .addItem('Validar', 'validateRadiator')
      .addItem('Actualizar Datos', 'updateRadiator'))
    .addSubMenu(ui.createMenu('Piping')
      .addItem('Actualizar Pérdida de Calor', 'updatePipeHeatLoss')
      .addItem('Actualizar Régimen de Flujo', 'updatePipeFlowState'))
    .addToUi();

}

/**
 * Test board parser 
 */
function testParseBoard() {
  let sheet = SpreadsheetApp.getActiveSheet();
  let range = SpreadsheetApp.getActiveRange();

  let board = StatusBoard.parseBoard(range)

  SpreadsheetApp.getUi().alert(JSON.stringify(board));
}

/**
 * Insert radiator model validation
 */
function validateRadiator() {
  let range = SpreadsheetApp.getActiveRange();
  
  let radiatorList = Radiator.allModels();
  let rule = SpreadsheetApp.newDataValidation().requireValueInList(radiatorList).build();

  range.clearDataValidations();
  range.setDataValidation(rule);
}

/**
 * Update radiator data
 */
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

/**
 * Update heat loss on piping
 */
function updatePipeHeatLoss() {
  let conditionsRange = InterfaceUtils.rangeByName("CondicionesSistemaCalefaccion");
  let pipeDiameterRange = InterfaceUtils.rangeByName("PipeSectionDiameter");
  let pipeInsulationRange = InterfaceUtils.rangeByName("PipeSectionHeat")

  let conditions = StatusBoard.parseBoard(conditionsRange).sections
                    .filter(s => s.title == "Condiciones" )[0];

  let tempHigh = conditions.properties
                    .filter(p => p.name == "Temperatura Superior")[0].value;
  
  let tempLow = conditions.properties
                    .filter(p => p.name == "Temperatura Inferior")[0].value;

  let tempEx = conditions.properties
                    .filter(p => p.name == "Temperatura Exterior")[0].value;
  
  let PPRpressure = conditions.properties
                    .filter(p => p.name == "PPR Presión Nominal")[0].value;

  if (typeof tempHigh != 'number' || 
      typeof tempLow != 'number' || 
      typeof tempEx != 'number' ||
      typeof PPRpressure != 'string') {
    throw 'Something happend with system conditions';
  }

  if (PPRpressure != "PN20" && PPRpressure != "PN16") {
    throw 'PPR Nominal Pressure must be PN16 or PN20';
  }

  let deltaTempHigh = tempHigh - tempEx;
  let deltaTempLow = tempLow - tempEx;

  let pipeValues = pipeDiameterRange.getValues();
  let insulatedValues = pipeInsulationRange.getValues();

  for (let i = 2; i < pipeValues.length; i++) {
    if (InterfaceUtils.isEmptyLine(pipeValues[i]) ||
        pipeValues[i][0].length != pipeValues[i][1].length ||
        insulatedValues[i][0] == "") {
      continue;
    }
  
    let diameter = pipeValues[i][2];
    let insulationThickness = insulatedValues[i][0];

    insulatedValues[i][1] = pprHeatLoss(PPRpressure, diameter, deltaTempHigh, insulationThickness);
    insulatedValues[i][2] = pprHeatLoss(PPRpressure, diameter, deltaTempLow, insulationThickness);
  }

  pipeInsulationRange.setValues(insulatedValues);
}

function updatePipeFlowState() {
  let conditionsRange = InterfaceUtils.rangeByName("CondicionesSistemaCalefaccion");
  let pipeDiameterRange = InterfaceUtils.rangeByName("PipeSectionDiameter");
  let pipeFlowRange = InterfaceUtils.rangeByName("PipeSectionFlowState");

  let PPRpressure = StatusBoard.parseBoard(conditionsRange).sections
    .filter(s => s.title == "Condiciones")[0].properties
    .filter(p => p.name == "PPR Presión Nominal")[0].value;

  if (PPRpressure != "PN20" && PPRpressure != "PN16") {
    throw 'PPR Nominal Pressure must be PN16 or PN20';
  }
  
  let pipeDiameterValues = pipeDiameterRange.getValues();
  let pipeFlowValues = pipeFlowRange.getValues();

  for (let i = 2; i < pipeDiameterValues.length; i++) {
    if (InterfaceUtils.isEmptyLine(pipeDiameterValues[i])) {
      continue;
    }

    let flow = pipeFlowValues[i][0];
    let diameter = pipeDiameterValues[i][2];

    // Not finished
  }
}
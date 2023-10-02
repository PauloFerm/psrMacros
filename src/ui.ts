const onOpen = (): void => {
  let ui = SpreadsheetApp.getUi()
  ui.createMenu('PSR')
    .addSubMenu(ui.createMenu('Demanda Térmica')
      .addItem('Validar Radiadores', 'validateRadiator')
      .addItem('Actualizar Radiadores', 'updateRadiator'))
    .addSubMenu(ui.createMenu('Sistema Calefacción')
      .addItem('Actualizar Pérdida de Calor', 'updatePipeHeatLoss')
      .addItem('Actualizar Régimen de Flujo', 'updatePipeFlowState'))
    .addSubMenu(ui.createMenu('Utilidades')
      .addItem('Tabla Markdown', 'table2md'))
    .addToUi();
}

const validateRadiator = ThermalDemand.validateRadiator;
const updateRadiator = ThermalDemand.updateRadiator;

const updatePipeHeatLoss = HeatSystem.updatePipeHeatLoss;
const updatePipeFlowState = HeatSystem.updatePipeFlowState;

/**
 * Export table in Markdown format
 */
const table2md = (): void => {
  const aligments = mdTables.tableAsMarkdown();
  SpreadsheetApp.getUi().alert(aligments);
}

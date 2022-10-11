function onOpen() {
  let ui = SpreadsheetApp.getUi()
  ui.createMenu('PSR')
    .addSubMenu(ui.createMenu('Boards')
      .addItem('Update Board', 'updateBoard'))
    .addToUi();

}

function updateBoard() {
  let sheet = SpreadsheetApp.getActiveSheet();
  let range = SpreadsheetApp.getActiveRange();

  let title = StatusBoard.cropBoard(range)

  SpreadsheetApp.getUi().alert(title);
}
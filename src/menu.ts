function onOpen() {
  let ui = SpreadsheetApp.getUi()
  ui.createMenu('PSR')
    .addSubMenu(ui.createMenu('Boards')
      .addItem('Parse Selected', 'parseBoard'))
    .addToUi();

}

function parseBoard() {
  let sheet = SpreadsheetApp.getActiveSheet();
  let range = SpreadsheetApp.getActiveRange();

  let board = StatusBoard.parseBoard(range)

  SpreadsheetApp.getUi().alert(JSON.stringify(board));
}
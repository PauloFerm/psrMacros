function test(description: string, action: any, value: any) {
  Logger.log(description, action == value);
}

function testPressures() {
  Logger.log(pprPressureLoss("PN20", 32, 0.4));
}
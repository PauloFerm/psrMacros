export namespace Radiator {
  // ["Altura", "Ancho", "Kcal/H", "Ejes", "Precio"],
  const towelDryers = [
    [700, 400, 221, 350, 89.22],
    [700, 450, 242, 400, 91.97],
    [700, 600, 305, 550, 117],
    [1160, 600, 486, 550, 181],
    [1385, 600, 605, 550, 214],
    [1195, 750, 1100, 700, 224],
  ];

  const radiatorWidths = [
    400, 500, 600, 700, 800, 900, 1000, 1100, 1200, 1300, 1400, 1500, 1600,
    1800, 2000, 2200, 2400, 2600, 2800, 3000,
  ];
  const models = ["EK 500", "DK 300", "DK 500"];

  /**
   * Returns all Radiator model names
   */
  export const allModels = (): string[] => {
    let list: string[] = [];

    for (let towelDry of towelDryers) {
      list.push(`TL ${towelDry[0]}/${towelDry[1]}`);
    }

    for (let model of models) {
      for (let width of radiatorWidths) {
        list.push(model + `/${width}`);
      }
    }

    return list;
  };

  export interface radiator {
    brand: string;
    panel: "EK" | "DK" | "TL";
    width: number;
    height: 300 | 500 | 700 | 1160 | 1385 | 1195;
    thicknees: 100;
    power: {
      kw: number;
      kcalh: number;
    };
    flow: number;
    volume: number;
    price?: number;
  }

  const power = [
    [389, 503, 756],
    [487, 629, 945],
    [584, 755, 1134],
    [681, 881, 1323],
    [778, 1006, 1512],
    [878, 1132, 1701],
    [973, 1258, 1890],
    [1070, 1384, 2079],
    [1168, 1510, 2268],
    [1265, 1635, 2457],
    [1362, 1761, 2646],
    [1460, 1887, 2835],
    [1557, 2013, 3024],
    [1751, 2264, 3402],
    [1946, 2516, 3780],
    [2141, 2768, 4158],
    [2335, 3019, 4536],
    [2530, 3271, 4914],
    [2724, 3522, 5292],
    [2919, 3774, 5670],
  ];

  const price = [
    [62.05, 76.06, 90.84],
    [71.34, 88.88, 107],
    [80.59, 102, 123],
    [89.87, 115, 138],
    [99.11, 127, 155],
    [109, 140, 170],
    [118, 153, 189],
    [127, 167, 203],
    [136, 179, 219],
    [146, 193, 234],
    [155, 206, 253],
    [164, 220, 268],
    [175, 230, 282],
    [193, 257, 314],
    [213, 282, 364],
    [230, 311, 399],
    [250, 335, 434],
    [268, 358, 466],
    [284, 386, 498],
    [301, 411, 533],
  ];

  /**
   * Flow rate by heat power
   * @param power in kW
   * @returns
   */
  const flowByPower = (power: number) => {
    let density = 1000;
    let specificHeat = 4.18;
    let deltaT = 20;
    let flow = power / (density * specificHeat * deltaT);

    return flow * 3600;
  };

  /**
   * Select radiator by model
   * @param model - Model name
   * @returns Radiator Object selected
   */
  export const select = (model: string): Radiator.radiator => {
    let [modelPanelHeight, modelWidth] = model.split("/");
    let [thisPanel, modelHeight] = modelPanelHeight.split(" ");
    let thisHeight = parseInt(modelHeight);
    let thisWidth = parseInt(modelWidth);

    /** TowelDryer handle */
    if (thisPanel == "TL") {
      let towelDry = towelDryers.filter(
        (t) => t[0] == thisHeight && t[1] == thisWidth
      )[0];

      if (towelDry == undefined) {
        throw `Error in radiator model ${thisPanel}`;
      }

      let thisRadiator: radiator = {
        brand: "Ocean",
        panel: "TL",
        width: thisWidth,
        height: thisHeight as 700 | 1160 | 1385 | 1195,
        thicknees: 100,
        flow: flowByPower(towelDry[2] / 860.42),
        volume: thisWidth / 104.167,
        power: {
          kcalh: towelDry[2],
          kw: towelDry[2] / 860.42,
        },
        price: towelDry[4],
      };

      return thisRadiator;
    }

    /** Radiator Panel handle */
    if (thisPanel != "EK" && thisPanel != "DK" && thisPanel != "TL") {
      throw `Error in radiator model ${thisPanel}`;
    }

    if (thisHeight != 300 && thisHeight != 500) {
      throw `Error in radiator model ${thisHeight}`;
    }

    if (radiatorWidths.indexOf(thisWidth) < 0) {
      throw `Error in radiator width ${thisWidth}`;
    }

    let modelIndex = models.indexOf(modelPanelHeight);
    let widthIndex = radiatorWidths.indexOf(thisWidth);

    let thisRadiator: radiator = {
      brand: "Ocean",
      panel: thisPanel,
      width: thisWidth,
      height: thisHeight,
      thicknees: 100,
      flow: flowByPower(power[widthIndex][modelIndex] / 860.42),
      volume: thisWidth / 104.167,
      power: {
        kcalh: power[widthIndex][modelIndex],
        kw: power[widthIndex][modelIndex] / 860.42,
      },
      price: price[widthIndex][modelIndex],
    };

    return thisRadiator;
  };
}

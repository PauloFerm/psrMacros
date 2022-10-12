namespace Radiator {
  const radiatorWidths = <const> [ 400, 500, 600, 700, 800, 900, 1000, 
                            1100, 1200, 1300, 1400, 1500, 1600, 1800, 
                            2000, 2200, 2400, 2600, 2800, 3000 ];
  export type radiatorWidth = typeof radiatorWidths[number];

  export interface radiator {
    name: string;
    panels: "EK" | "DK";
    width: radiatorWidth;
    height: 300 | 500;
    thicknees: 100;
    power: {
      kw: number,
      kcalh: number
    };
    price?: number;
  };

  const oceanRadiatorsData = { }
}
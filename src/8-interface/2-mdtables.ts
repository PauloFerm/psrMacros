export namespace mdTables {
  type mdFlush = " :--- " | " :---: " | " ---: ";
  type hAlign =
    | "general"
    | "general-left"
    | "general-right"
    | "right"
    | "left"
    | "center";

  /**
   * Map aligment description to Markdown notation
   */
  const mapAligment = (
    ali: string,
    index: number,
    values: string[]
  ): mdFlush => {
    let mdAligment: mdFlush = " :--- ";

    switch (ali) {
      case "general": {
        let cellValue = values[index];
        mdAligment = isNaN(parseInt(cellValue)) ? " :--- " : " ---: ";
        break;
      }
      case "general-left": {
        mdAligment = " :--- ";
        break;
      }
      case "general-right": {
        mdAligment = " ---: ";
        break;
      }
      case "left": {
        mdAligment = " :--- ";
        break;
      }
      case "right": {
        mdAligment = " ---: ";
        break;
      }
      case "center": {
        mdAligment = " :---: ";
        break;
      }
    }

    return mdAligment;
  };

  /**
   * Join row array with `|` character
   */
  const rowMD = (rowValues: string[]): string => {
    return `| ${rowValues.join(" | ")} |`;
  };

  interface CellFormat {
    monospaced: boolean;
    decimals?: number;
    percentage?: boolean;
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;
  }

  const isMonospaced = (family: string): boolean => {
    return family.indexOf("Mono") > 0 || family.indexOf("Courier") > 0;
  };

  const isBold = (weight: string): boolean => {
    return weight == "bold";
  };

  const isItalic = (style: string): boolean => {
    return style == "italic";
  };

  const isUnderline = (line: string): boolean => {
    return line == "underline";
  };

  const isPercentage = (format: string): boolean => {
    return format.indexOf("%") > 0;
  };

  const numberOfDecimals = (numberFormated: string): number => {
    let dotPlace: number = numberFormated.indexOf(".");

    return dotPlace < 0 ? 0 : numberFormated.length - (dotPlace + 1);
  };

  /**
   * Obtain spreadsheet format and map it to `CellFormat[]`
   */
  const getFormats = (
    formats: string[],
    families: string[],
    weights: string[],
    styles: string[],
    lines: string[]
  ): CellFormat[] => {
    if (formats.length != families.length) {
      throw "Formats and Families must be the same length";
    }

    let cellFormats: CellFormat[] = formats.map((format, i) => {
      return {
        monospaced: isMonospaced(families[i]),
        decimals: numberOfDecimals(format),
        percentage: isPercentage(format),
        bold: isBold(weights[i]),
        italic: isItalic(styles[i]),
        underline: isUnderline(lines[i]),
      };
    });

    return cellFormats;
  };

  /**
   * Format number decimals and percentage symbol
   */
  const formatNumber = (value: string, format: CellFormat): string => {
    if (
      typeof value == "string" &&
      value.indexOf(".") != value.lastIndexOf(".")
    ) {
      return value;
    }

    let asNumber = parseFloat(value);

    if (isNaN(asNumber)) {
      return value;
    }

    asNumber = format.percentage ? asNumber * 100 : asNumber;
    let numberFormated = asNumber.toFixed(format.decimals);

    return format.percentage ? numberFormated + " %" : numberFormated;
  };

  /**
   * Apply Markdown format arround the string
   */
  const setFormat = (value: string, format: CellFormat): string => {
    value = formatNumber(value, format);
    value = format.monospaced ? `\`${value}\`` : value;
    value = format.bold ? `**${value}**` : value;
    value = format.italic ? `*${value}*` : value;
    value = format.underline ? `<u>${value}</u>` : value;

    return value;
  };

  /**
   * ActiveRange to Markdown with the 1st row format
   */
  export const tableAsMarkdown = (): string => {
    const activeRange = SpreadsheetApp.getActiveRange();
    const activeValues = activeRange.getValues();

    const headerRowsValues = activeValues[0];
    const bodyRowsValues = activeValues.slice(1);

    const firstRowAligment = activeRange.getHorizontalAlignments()[1];

    const formats = getFormats(
      activeRange.getNumberFormats()[1],
      activeRange.getFontFamilies()[1],
      activeRange.getFontWeights()[1],
      activeRange.getFontStyles()[1],
      activeRange.getFontLines()[1]
    );

    let mdAligment: mdFlush[] = firstRowAligment.map((ali, i) =>
      mapAligment(ali, i, bodyRowsValues[0])
    );

    let headerRow: string = rowMD(headerRowsValues);
    let alignRow: string = rowMD(mdAligment);
    let bodyRows: string[] = bodyRowsValues.map((row) =>
      rowMD(row.map((value, i) => setFormat(value, formats[i])))
    );

    let table: string = [headerRow, alignRow, ...bodyRows].join("\n");

    return table;
  };
}

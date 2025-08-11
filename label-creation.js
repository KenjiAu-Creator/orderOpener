import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  HeightRule,
  AlignmentType,
} from "docx";
import fs from "fs";

const INCH_TO_TWIP = 1440;

export async function createAvery48160Labels(
  labelsData,
  outputFileName = null
) {
  const sheetWidthInches = 8.5;
  const sheetHeightInches = 11;
  const cols = 3;
  const rows = 10; // 30 labels total
  const labelWidthInches = 2.625;
  const labelHeightInches = 1.0;

  // Calculate margins to center labels on the page
  const horizontalMargin = (sheetWidthInches - cols * labelWidthInches) / 2;
  const verticalMargin = (sheetHeightInches - rows * labelHeightInches) / 2;

  // If the name is not supplied then use the current date
  if (!outputFileName) {
    outputFileName = `avery-48160-labels-${getCurrentDateString()}.docx`;
  }

  const tableRows = [];
  for (let r = 0; r < rows; r++) {
    const cells = [];
    for (let c = 0; c < cols; c++) {
      const idx = r * cols + c;
      const label = labelsData[idx];

      let paragraphChildren = [];
      if (label) {
        paragraphChildren = [
          new TextRun({ text: label.name || "", size: 28 }),
          new TextRun({ break: 1 }),
          new TextRun({
            text: `${label.orderNumber || ""}`,
            size: 28,
          }),
          new TextRun({ break: 1 }),
          new TextRun({ text: label.address || "", size: 28 }),
          new TextRun({ break: 1 }),
          new TextRun({ text: label.location || "", size: 28 }),
        ];
      }

      cells.push(
        new TableCell({
          width: { size: labelWidthInches * INCH_TO_TWIP, type: WidthType.DXA },
          height: {
            value: labelHeightInches * INCH_TO_TWIP,
            rule: HeightRule.EXACT,
          },
          margins: { top: 100, bottom: 100, left: 100, right: 100 },
          children: [
            new Paragraph({
              alignment: AlignmentType.LEFT,
              children:
                paragraphChildren.length > 0
                  ? paragraphChildren
                  : [new TextRun("")],
            }),
          ],
        })
      );
    }
    tableRows.push(new TableRow({ children: cells }));
  }

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            size: {
              width: sheetWidthInches * INCH_TO_TWIP,
              height: sheetHeightInches * INCH_TO_TWIP,
            },
            margin: {
              top: verticalMargin * INCH_TO_TWIP,
              bottom: verticalMargin * INCH_TO_TWIP,
              left: horizontalMargin * INCH_TO_TWIP,
              right: horizontalMargin * INCH_TO_TWIP,
            },
          },
        },
        children: [new Table({ rows: tableRows })],
      },
    ],
  });

  return Packer.toBuffer(doc).then((buffer) => {
    fs.writeFileSync(outputFileName, buffer);
    console.log(`Generated ${outputFileName}`);
  });
}

// Example usage:
const exampleLabels = [
  {
    name: "John Doe",
    address: "123 Maple St",
    location: "Springfield, IL",
    orderNumber: "A001",
  },
  {
    name: "Jane Smith",
    address: "456 Oak Ave",
    location: "Greenville, SC",
    orderNumber: "A002",
  },
];

function getCurrentDateString() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0"); // months are 0-indexed
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

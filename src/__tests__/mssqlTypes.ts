import ts from 'typescript'
import { inspect } from "util"
import { mssqlTypes } from "../mssqlTypes"

const printer = ts.createPrinter({ newLine: ts.NewLineKind.CarriageReturnLineFeed });

describe('mssqlTypes', () => {
  fit('Generates primary keys and schema from reading tables', () => {
    const t = mssqlTypes([{
      TABLE_NAME: 'someTable',
      COLUMN_NAME: 'a',
      IS_IDENTITY: 'YES',
      COLUMN_DEFAULT: null,
      IS_NULLABLE: 'YES',
      DATA_TYPE: 'nvarchar',
    }], 'my-schema')
    
    const source = ts.factory.createSourceFile(
      t.source,
      ts.factory.createToken(ts.SyntaxKind.EndOfFileToken),
      ts.NodeFlags.None
    )

    expect(printer.printFile(source)).toMatchSnapshot()
  })
})

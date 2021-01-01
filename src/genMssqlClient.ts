import { ConnectionPool, VarChar, IResult } from 'mssql'
import * as ts from 'typescript'
import { env } from './env';
import { config } from 'dotenv'
import { inspect } from 'util'
import { RSA_NO_PADDING } from 'constants';

const { factory } = ts

type TableColumn = {
  PRIMARY_KEY: 'YES' | 'NO',
  TABLE_SCHEMA: string,
  TABLE_NAME: string ,
  COLUMN_NAME: string,
  IS_NULLABLE: 'YES' | 'NO',
  DATA_TYPE: 'varchar' | 'int' | 'data' | 'decimal' | 'text' | 'DateTime',
  CHARACTER_MAXIMUM_LENGTH: number,
  CHARACTER_OCTET_LENGTH: number,
  NUMERIC_PRECISION: null | number,
  NUMERIC_PRECISION_RADIX: null | number,
}

const printer = ts.createPrinter({ newLine: ts.NewLineKind.CarriageReturnLineFeed });

export type Table = TableColumn[]

export async function run () {
  config()
  const tables = env('tables').split(',')
  console.log(tables)

  const pool = new ConnectionPool({
    user: env('user'),
    password: env('password'),
    database: env('database'),
    server: env('server'),
    port: parseInt(env('port')),
    connectionTimeout: 5000,
    requestTimeout: 40000,
  });

  const schemas = {}

  // const myClass = factory.createClassDeclaration(
  //   undefined,
  //   undefined,
  //   factory.createIdentifier("Something"),
  //   undefined,
  //   undefined,
  //   [factory.createMethodDeclaration(
  //     undefined,
  //     undefined,
  //     undefined,
  //     factory.createIdentifier("name"),
  //     undefined,
  //     undefined,
  //     [factory.createParameterDeclaration(
  //       undefined,
  //       undefined,
  //       undefined,
  //       factory.createIdentifier("name"),
  //       undefined,
  //       factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword),
  //       undefined
  //     )],
  //     undefined,
  //     factory.createBlock(
  //       [],
  //       true
  //     )
  //   )]
  // )
  

  // console.log(printer.printNode(
  //   ts.EmitHint.Unspecified,
  //   myClass,
  //   ts.createSourceFile("source.ts", "", ts.ScriptTarget.ES2015)
  // ))

  //const st = ts.factory.createNotEmittedStatement(myClass)

  //ts.factory.createSourceFile(
  //  [st],
  //  ts.,
  //  ts.NodeFlags.None
  //)
  await pool.connect()

  console.log(tables)
  for (const table of tables) {
    const { recordset }: IResult<TableColumn> = await pool
    .request()
    .input('TABLE_NAME', VarChar, table)
    .query(`
      SELECT col.*,
      (case when COLUMNPROPERTY(object_id(con.TABLE_SCHEMA+'.'+con.TABLE_NAME), col.COLUMN_NAME, 'IsIdentity') = 1 then 'Yes' else 'No' end) as IS_IDENTITY
      FROM INFORMATION_SCHEMA.COLUMNS col
      INNER JOIN INFORMATION_SCHEMA.CONSTRAINT_COLUMN_USAGE con ON con.Table_Name = col.TABLE_NAME
      WHERE con.TABLE_NAME = @TABLE_NAME
    `)

    console.log(inspect(recordset, { depth: 10 }))

  //  // create type
  //  // create select
  //  // create insert
  //  // create upadte
  }
}

run()

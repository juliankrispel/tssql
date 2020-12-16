import { ConnectionPool, VarChar, IResult } from 'mssql'
import * as ts from 'typescript'
import { env } from './env';
import { config } from 'dotenv'
import { inspect } from 'util'
import { RSA_NO_PADDING } from 'constants';

const { factory } = ts

export type TableColumn = {
  PRIMARY_KEY: boolean,
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

  // await pool.connect()

  const schemas = {}

  const myClass = factory.createClassDeclaration(
    undefined,
    undefined,
    factory.createIdentifier("Something"),
    undefined,
    undefined,
    [factory.createMethodDeclaration(
      undefined,
      undefined,
      undefined,
      factory.createIdentifier("name"),
      undefined,
      undefined,
      [factory.createParameterDeclaration(
        undefined,
        undefined,
        undefined,
        factory.createIdentifier("name"),
        undefined,
        factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword),
        undefined
      )],
      undefined,
      factory.createBlock(
        [],
        true
      )
    )]
  )
  

  console.log(printer.printNode(
    ts.EmitHint.Unspecified,
    myClass,
    ts.createSourceFile("source.ts", "", ts.ScriptTarget.ES2015)
  ))

  //const st = ts.factory.createNotEmittedStatement(myClass)

  //ts.factory.createSourceFile(
  //  [st],
  //  ts.,
  //  ts.NodeFlags.None
  //)

  //for (const table of tables) {
  //  const { recordset }: IResult<TableColumn> = await pool
  //  .request()
  //  .input('TABLE_NAME', VarChar, table)
  //  .query(`select * from INFORMATION_SCHEMA.COLUMNS c where TABLE_NAME  = @TABLE_NAME`)

  //  // create type
  //  // create select
  //  // create insert
  //  // create upadte
  //}
}

// run()

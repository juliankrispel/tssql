import ts, { factory, isJSDocEnumTag } from "typescript"
import { camelCase } from 'camel-case'

export type DataType = 'varchar' | 'int' | 'data' | 'decimal' | 'text' | 'datetime2' |'DateTime' | 'timestamp' | 'bigint' | 'nvarchar'

export type TableColumn = {
  IS_IDENTITY: 'YES' | 'NO',
  TABLE_NAME: string ,
  COLUMN_NAME: string,
  IS_NULLABLE: 'YES' | 'NO',
  DATA_TYPE: DataType,
}

export function dataType(type: DataType) {
  if (type === 'DateTime' || type === 'timestamp' || type === 'datetime2') {
    return factory.createTypeReferenceNode(
      factory.createIdentifier("Date"),
      undefined
    )
  } else if (type === 'int' || type === 'decimal') {
    return factory.createKeywordTypeNode(
      ts.SyntaxKind.NumberKeyword
    )
  } else {
    return factory.createKeywordTypeNode(
      ts.SyntaxKind.StringKeyword
    )
  }
}

export function value(col: TableColumn){
  if (col.IS_NULLABLE === 'YES') {
    return factory.createUnionTypeNode([
      dataType(col.DATA_TYPE),
      factory.createLiteralTypeNode(factory.createNull())
    ])
  } else {
    return dataType(col.DATA_TYPE)
  }
}

export function mssqlTypes(cols: TableColumn[], name: string) {
  const tables: {
    [key: string]: ts.PropertySignature[]
  } = {}
  const identityKeys: {
    [key: string]: string
  } = {}
  let schemaName = camelCase(name)
  schemaName = schemaName[0].toUpperCase() + schemaName.substr(1)

  for (const col of cols) {
    const tableName = col.TABLE_NAME
    tables[tableName] ||= []

    if (col.IS_IDENTITY === 'YES') {
      identityKeys[tableName] = col.COLUMN_NAME
    }

    tables[tableName].push(factory.createPropertySignature(
      undefined,
      factory.createIdentifier(col.COLUMN_NAME),
      undefined,
      value(col)
    ))
  }

  const primaryKeysTypeIdentifier = `${schemaName}PrimaryKeys`

  return {
    schemaName,
    primaryKeysTypeIdentifier,
    source: [
      factory.createTypeAliasDeclaration(
        undefined,
        undefined,
        factory.createIdentifier(primaryKeysTypeIdentifier),
        undefined,
        factory.createTypeLiteralNode(
          Object.keys(identityKeys).map(table => (
            factory.createPropertySignature(
              undefined,
              factory.createIdentifier(table),
              undefined,
              factory.createLiteralTypeNode(factory.createStringLiteral(identityKeys[table]))
            )
          ))
        ),
      ),
      factory.createTypeAliasDeclaration(
        undefined,
        undefined,
        factory.createIdentifier(schemaName),
        undefined,
        factory.createTypeLiteralNode(
          Object.keys(tables).map((col) => {
            return factory.createPropertySignature(
              undefined,
              factory.createIdentifier(col),
              undefined,
              factory.createTypeLiteralNode(tables[col])
            )
          })
        ),
      )
    ]
  }
}

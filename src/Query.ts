type Val = number | null | Date | string

type Operator = '=' | '>' | '>=' | '<' | '<='

type TableSchema = {
  [key: string]: Val
}

type PrimaryKeys<T extends Schema> = {
  [p in keyof T]: string
}

type JoinType = 'inner' | 'left' | 'right' | 'full'

type Schema = {
  [key: string]: TableSchema
}

interface Where<
  T extends Schema,
  F extends keyof T,
  F2
> {
  (
    col: DotSelect<T, F | F2>,
    operator: Operator,
    value: Val
  ) : {
    select: Select<DotSelect<T, F | F2>>,
  }
}

interface UpdateWhere<
  T extends Schema,
  F extends keyof T
> {
  (
    col: keyof T[F],
    operator: Operator,
    value: Val
  ) : string
}


interface Select<C> {
  (...columns: C[]): string 
}

type DotSelect<
  T extends Schema,
  K,
> = 
  K extends keyof T ? (`${string & K}.${string & (keyof T[K])}`) : never

interface Join<
  T extends Schema,
  F extends keyof T,
  F2 extends keyof T
> {
  <J extends Exclude<keyof T, F | F2>>(
    type: JoinType,
    col: J,
    left: DotSelect<T, F | F2>,
    right: DotSelect<T, J>
  ) : {
    select: Select<DotSelect<T, J | F | F2>>,
    join: Join<T, F, J>,
    where: Where<T, F, J | F2>,
  }
}

interface From<
  T extends Schema
> {
  <F extends keyof T>(from: F): {
    select: Select<keyof T[F]>,
    join: Join<T, F, never>,
    where: Where<T, F, never>,
  }
}

interface Insert<
  T extends Schema,
  P extends PrimaryKeys<T>
> {
  <I extends keyof T>(
    table: I,
    value: Omit<T[I], P[I]>
  ): string
}

interface Update<
  T extends Schema,
  P extends PrimaryKeys<T>
> {
  <I extends keyof T>(
    table: I,
    value: Partial<T[I]>
  ): {
    where: UpdateWhere<T, I>
  }
}

const validLocalVariable = /^@[a-zA-Z0-9_$#]+$/

function value(val: Val) {
  if (val instanceof Date) {
    if (isNaN(val.getDate())) {
      throw new Error('invalid date')
    }
    return val.toISOString()
  } else if (typeof val === 'number') {
    return val
  } else if (val === null) {
    return null
  } else if (validLocalVariable.test(val)) {
    return val
  } else {
    return `'${val.replace('\'', "\\'")}'`
  }
}

function select(
  this: QueryState,
  ...cols: unknown[]
) {
  this.select = cols.join(', ')
  return ''
}

function join(
  this: QueryState, 
  type: JoinType,
  col: unknown,
  left: unknown,
  right: unknown
): any {
  this.joins.push(`${type} ${col} on ${left} = ${right}`)
  
  return {
    select: select.bind(this),
    join: join.bind(this),
    where: where.bind(this),
  }
}

function where(
  this: QueryState, 
  col: unknown,
  operator: Operator,
  val: Val
) {
  this.where = `${col} ${operator} ${value(val)}`

  return {
    select: select.bind(this)
  }
}

function updateWhere(
  this: QueryState, 
  col: unknown,
  operator: Operator,
  val: Val
) {
  this.where = `${col} ${operator} ${value(val)}`

  return ''
}

function from(
  this: QueryState,
  f: unknown
) {
  this.from = f
  return {
    select: select.bind(this),
    join: join.bind(this),
    where: where.bind(this)
  }
}

function insert(
  this: QueryState,
  table: unknown,
  val: unknown
) {
  this.insertInto = table
  this.insertValue = val
  return ''
}

function update(
  this: QueryState,
  table: unknown,
  val: Partial<TableSchema>
) {
  this.updateInto = table
  this.updateValue = val
  return {
    where: updateWhere.bind(this)
  }
}

type QueryState = {
  from?: unknown,
  select?: unknown,
  joins: unknown[],
  where?: unknown,
  innerJoin?: unknown,
  insertInto?: unknown,
  insertValue?: unknown,
  updateInto?: unknown,
  updateValue?: Partial<TableSchema>,
}

function query<
  T extends Schema,
  P extends PrimaryKeys<T>
>() {
  const _from: From<T> = from
  const _insert: Insert<T, P> = insert
  const _update: Update<T, P> = update
  const state: QueryState = { joins: [] }

  return {
    from: _from.bind(state),
    insert: _insert.bind(state),
    update: _update.bind(state),
  }
}

type S = {
  a: {
    id: string, 
    a1: number,
    a2: string
  },
  b: {
    id2: string, 
    b1: string,
    b2: number
  },
  c: {
    id3: string, 
    c1: string,
    c2: number,
  }
}

type P = {
  a: 'id',
  b: 'id2'
  c: 'id3'
}

const q = query<S, P>()

q.from('a')
  .join('full', 'c', 'a.a1', 'c.c2')
  .join('left', 'b', 'c.c1', 'b.b1')
  .where('c.c2', '=', 'd21')

q.insert(
  'c',
  {
    c1: '1',
    c2: 1
  }
)

q.update(
  'c',
  {
    c1: 'dwq'
  }
).where('c1', '=', 'dwq')

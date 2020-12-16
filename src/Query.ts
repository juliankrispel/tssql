type Val = number | null | Date | string

type Operator = '=' | '>' | '>=' | '<' | '<='

type Table = {
  [key: string]: Val
}

type JoinType = 'inner' | 'left' | 'right' | 'full'

type Schema = {
  [key: string]: Table
}

interface Where<
  T extends Schema,
  F extends keyof T,
> {
  <C extends keyof T[F]>(
    col: C,
    operator: Operator,
    value: Val
  ) : {
    select: Select<keyof T[F]>,
  }
}

interface Select<C> {
  (...columns: C[]): string 
}

type M = `${keyof S}${keyof S['a']}`

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
    where: Where<T, F>,
  }
}

interface From<
  T extends Schema
> {
  <F extends keyof T>(from: F): {
    select: Select<keyof T[F]>,
    join: Join<T, F, never>,
    where: Where<T, F>,
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

function from(this: QueryState, f: string) {
  this.from = f
  return {
    select: select.bind(this),
    join: join.bind(this),
    where: where.bind(this)
  }
}

type QueryState = {
  from?: string,
  select?: string,
  joins: string[],
  innerJoin?: string,
  where?: string,
}

function query() {
  const _from: From<S> = from
  const state: QueryState = { joins: [] }
  return {
    from: _from.bind(state)
  }
}

type S = {
  a: {
    id: string, 
    a1: number,
    a2: string
  },
  b: {
    b1: string,
    b2: number
  },
  c: {
    c1: string,
    c2: number,
  }
}

const q = query()
.from('a')
.join('inner', 'b', 'a.a1', 'b.b2')
.join('left', 'c', 'b.b2', 'c.c1')
.select('a.a1', 'b.b2')

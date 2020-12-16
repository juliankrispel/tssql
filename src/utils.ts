export type ValueOf<T extends ReadonlyArray<unknown>> = T[number]


// type C = { [p in ValueOf<["hello"]>]: string }
// 
// 
// const c: C = {hello: 'dwq'}



const array = ['one', 'two'] as const

type Zip<T extends ReadonlyArray<string>> = { [p in ValueOf<T>]: true }

function zip<T extends ReadonlyArray<string>>(ar: T): Zip<T> {
  return ar.reduce((acc, val) => ({
    ...acc,
    [val]: true
  }), {} as Zip<T>)
}

const some = zip(array)

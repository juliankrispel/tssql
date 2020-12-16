

```ts

type Tables = {
  table1: {
    column1: number,
    column2: string
  },
  table2: {
    column1: number,
    column2: string
    column3: date
  }
}

const q = new Query<Tables>()
q
.from('table1')
.select('column1', 'column2')
.join('table2', )
```



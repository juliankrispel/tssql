WIP - not ready for use

```ts
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
```



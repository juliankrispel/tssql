// import { AllKeys, Query } from "../Query.txs"
// 
// type Schema = {
//   a: {
//     primary: ['id', string],
//     columns: {
//       a1: string,
//       a2: number
//     }
//   },
//   b: {
//     primary: ['id', string],
//     columns: {
//       b1: string
//     }
//   }
// }
// 
// type B = AllKeys<Schema['a']>
// 
// const q = new Query<Schema>()
// 
// describe('Query', () => {
//   test.each`
//     select                    | from            | where                                     | output
//     ${['id', 'a1']}           | ${'a'}          | ${[['a1', '=', 12]]}                      | ${'SELECT id, a1 FROM a WHERE a1 = 12'}
//     ${['id', 'a1', 'a2']}     | ${'a'}          | ${[['a1', '=', 12], ['a2', '>', '2']]}    | ${"SELECT id, a1, a2 FROM a WHERE a1 = 12 AND a2 > '2'"}
//     ${['id', 'a1', 'a2']}     | ${'a'}          | ${[['a1', '=', "@HELLO"]]}                | ${'SELECT id, a1, a2 FROM a WHERE a1 = @HELLO'}
//     ${['id', 'a1', 'a2']}     | ${'a'}          | ${[['a1', '=', "@HEL,dwqLO"]]}            | ${"SELECT id, a1, a2 FROM a WHERE a1 = '@HEL,dwqLO'"}
//     ${['id', 'a1', 'a2']}     | ${'a'}          | ${[['a1', '=', "hel'dwq"]]}               | ${"SELECT id, a1, a2 FROM a WHERE a1 = 'hel\\'dwq'"}
//   `('q.select($select, { from: $from, where: $where }) == $output', ({ select, from, where, output }) => {
//     if (output)
//     expect(q.select(select, { from, where })).toEqual(output)
//   })
// 
// 
//   it('select', () => {
//     q.select(['b1', 'id'], { from: 'b', where: [[
//       'b1',
//       '=',
//       '123'
//     ]], 
//     join: [
//       'a',
//       'a1',
//       'b1'
//     ]
//   })
//   })
// })
// 

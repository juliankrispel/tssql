import { env } from "../env"

describe('env', () => {
  it('returns env var', () => {
    expect(env('ENVIRONMENT')).toMatchSnapshot()
    expect(env('user')).toMatchSnapshot()
    expect(env('password')).toMatchSnapshot()
    expect(env('password')).toMatchSnapshot()
  })

  it('throws if env var is not defined or null', () => {
    expect(() => env('nullvar')).toThrowErrorMatchingSnapshot()
  })
})



type V = number | null | Date | string
type Y = {
  [key: string]: V
}

type Z = {
  [key: string]: Y
}

function z<
  H extends keyof Z,
  I extends keyof Z
>(
  w: W,
  s: `b-${string & H | I}`
) {}

z()

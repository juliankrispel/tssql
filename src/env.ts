import { ValueOf } from "./utils"

/**
 * Retrieve one env variable, throws if variable anything other than string
 */
export function env(name: string): string {
  const _var = process.env[name]
  if (typeof _var !== 'string') {
    throw new Error(`process.env['${name}'] must be type of string, currently '${typeof _var}'`)
  } 
  return _var
}

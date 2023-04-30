const ec = new TextEncoder()
const dc = new TextDecoder()

const crypto = globalThis.crypto

export function sleep(ms : number = 500) {
  return new Promise(res => setTimeout(res, ms))
}

export function normalizeParams (
  params : Record<string, string | string[] | undefined>
) : Record<string, string | undefined> {
  const p : Record<string, string | undefined> = {}
  for (let [ k, v ] of Object.entries(params)) {
    if (Array.isArray(v)) v = v.pop()
    p[k] = v
  }
  return p 
}

export function getFormData (
  formData : HTMLFormElement
) : Record<string, string> {
  const formObj : Record<string, string> = {}
  const entries = new FormData(formData).entries()
  for (const [ key, val ] of entries) {
    formObj[key] = String(val)
  }
  return formObj
}

export function getRandString() : string {
  const chars = crypto.getRandomValues(new Uint8Array(32)).map(n => n % 88 + 40)
  return btoa(dc.decode(chars))
}

export async function sha256(str : string) {
  return crypto.subtle.digest('SHA-256', ec.encode(str))
    .then(buff => btoa(dc.decode(buff)))
}

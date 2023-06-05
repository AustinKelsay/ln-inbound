import { Buff }   from '@cmdcode/buff-utils'
import { config } from '@/config'

interface LNDInvoiceCreate {
  memo             ?: string   // <string> 
  hash             ?: string   // <bytes> (base64 encoded)
  value            ?: string   // <int64> 
  value_msat       ?: string   // <int64> 
  description_hash ?: string   // <bytes> (base64 encoded)
  expiry           ?: string   // <int64> 
  fallback_addr    ?: string   // <string> 
  cltv_expiry      ?: string   // <uint64> 
  route_hints      ?: string[] // <RouteHint> 
  private          ?: boolean  // <bool> 
}

interface createInvoice {
  amount : number
  hash  ?: string
  memo  ?: string
}

interface LNDResponse {
  ok    : boolean
  data ?: any
  err  ?: string
}

export async function getInfo () {
  return fetchEndpoint('/v1/getinfo')
}

export async function getBalance () {
  return fetchEndpoint('/v1/balance/blockchain')
}

export async function getPeers () {
  return fetchEndpoint('/v1/peers')
}

export async function getOpenChannels () {
  return fetchEndpoint('/v1/channels')
}

export async function getPendingChannels () {
  return fetchEndpoint('/v1/channels/pending')
}

export async function openChannel (
  pubkey  : string, 
  amount  : number,
  options : any = {} 
) {
  const b64 = Buff.hex(pubkey).b64url
  const opt = {
    method  : 'POST',
    body    : JSON.stringify({ node_pubkey: b64, local_funding_amount: amount, ...options })
  }

  return fetchEndpoint('/v1/channels', opt)
}

export async function addPeer (
  pubkey : string,
  host   : string,
  perm = false
) {
  const opt = {
    method  : 'POST',
    body    : JSON.stringify({ addr : { pubkey, host }, perm })
  }
  return fetchEndpoint('/v1/peers', opt)
}

export async function createInvoice ({
  amount, hash, memo
} : createInvoice ) {
  const body : Record<string, string> = { value_msat: String(amount) }
  if (hash !== undefined) body.description_hash = hash
  if (memo !== undefined) body.memo = memo
  const opt = {
    method  : 'POST',
    body    : JSON.stringify(body)
  }
  return fetchEndpoint('/v1/invoices', opt)
}

export async function lookupInvoice (hash : string) {
  const urlsafe = hash.replaceAll('+', '-').replaceAll('/', '_')
  return fetchEndpoint('/v2/invoices/lookup?payment_hash=' + urlsafe)
}

export async function cancelInvoice (hash : string) {
  const body : Record<string, string> = { payment_hash: hash }
  const opt = {
    method  : 'POST',
    body    : JSON.stringify(body)
  }
  return fetchEndpoint('/v2/invoices/cancel?payment_hash=' + hash, opt)
}

async function fetchEndpoint(endpoint : string, opt : RequestInit = {}) : Promise<LNDResponse> {
  const hostname = config.lnd_hostname
  const macaroon = config.lnd_macaroon

  if (hostname === undefined) {
    throw 'Environment varaible \'LND_HOSTNAME\' is undefined!'
  }

  if (macaroon === undefined) {
    throw 'Environment varaible \'LND_MACAROON\' is undefined!'
  }

  if (process.env.NODE_ENV !== 'production') {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"
  }

  opt.headers = { 
    ...opt.headers,
    'Grpc-Metadata-macaroon': macaroon 
  }

  try {
    const res = await fetch(new URL(hostname + endpoint), opt)

    const { ok, status, statusText } = res

    if (!res.ok) {
      let data, err
      try { 
        data = await res.json() 
        err  = data.message
      } catch { err = statusText }
      console.error('Request failed!', status, statusText, data, endpoint, opt, )
      return { ok, data, err }
    }

    return { ok, data: await res.json() }
  } catch (err) {
    console.log(err)
    const { message } = err as any
    return { ok: false, err: message as string }
  }

}


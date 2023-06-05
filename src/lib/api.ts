import { getPendingChannels, getOpenChannels } from '@/lib/lnd'

export async function getUserOpenChannels (pubkey : string) {
  const { ok, data, err } = await getOpenChannels()

  if (!ok || data === undefined) {
    return { ok: false, data, err }
  }

  const { channels: open_channels } = data

  if (!Array.isArray(open_channels)) {
    throw new Error('Open channels is not an array!')
  }

  return {
    ok   : true,
    data : open_channels.filter((e : any) => e.remote_pubkey === pubkey)
  }
}

export async function getUserPendingChannels (pubkey : string) {
  const { ok, data, err } = await getPendingChannels()

  if (!ok || data === undefined) {
    return { ok: false, data, err }
  }
  
  const { pending_open_channels: pending_channels } = data

  if (!Array.isArray(pending_channels)) {
    throw new Error('Pending channels is not an array!')
  }

  return {
    ok   : true,
    data : pending_channels.filter((e : any) =>  e.channel.remote_node_pub === pubkey)
  }
}

export async function getFees() {
  const res = await fetch('https://mempool.space/api/v1/fees/recommended')
  if (!res.ok) {
    const { status, statusText } = res
    throw new Error(`Failed to fetch fee rates: ${status} ${statusText}`)
  } 
  return res.json()
}

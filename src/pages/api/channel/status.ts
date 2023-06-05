import type { NextApiRequest, NextApiResponse } from 'next'

import { withSessionRoute } from '@/lib/sessions'
import { getOpenChannels, getPendingChannels } from '@/lib/lnd'

export default withSessionRoute(handler)

async function handler (
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { pubkey } = req.session

    if (pubkey === undefined) {
      return res.status(200).json({ ok: false, err: 'Session has expired!' })
    }

    const open_channels = await getUserOpenChannels(pubkey)

    if (!open_channels.ok) {
      const { data, err } = open_channels
      return res.status(200).json({ ok: false, ...data, err })
    }

    const pend_channels = await getUserPendingChannels(pubkey)

    if (!pend_channels.ok) {
      const { data, err } = pend_channels
      return res.status(200).json({ ok: false, ...data, err })
    }

    const data = {
      open    : open_channels.data,
      pending : pend_channels.data
    }

    return res.status(200).json({ ok: true, data })
  } catch(err) { 
    console.error(err)
    res.status(500).end() 
  }
}

async function getUserOpenChannels (pubkey : string) {
  const { ok, data, err } = await getOpenChannels()

  if (!ok || data === undefined) {
    return { ok: false, ...data, err }
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

async function getUserPendingChannels (pubkey : string) {
  const { ok, data, err } = await getPendingChannels()

  if (!ok || data === undefined) {
    return { ok: false, ...data, err }
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

// user_channels = channels.filter((e : any) => e.channel.remote_node_pub === pubkey)

// if (user_channels !== undefined) {
//   channel = channel.channel
// }

// if (channel !== undefined) {
//   channel = channel.channel_point.split(':')[0]
// }

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
      return res.status(200).json({ ok: false, err: 'No pubkey is set!' })
    }

    let status, txid

    const { ok, data, err } = await getOpenChannels()

    if (!ok || data === undefined || err !== undefined) {
      return res.status(200).json({ ok: false, err })
    }

    const { channels } = data

    if (!Array.isArray(channels)) {
      console.log('channels is not an array:', channels)
     return res.status(500).end() 
    }

    const active = channels.filter((e : any) => e.remote_pubkey === pubkey)[0] ?? undefined

    console.log('active:', active)

    if (active !== undefined) {
      txid   = active.channel_point.split(':')[0]
      status = 'active'
    } else {
      const { ok, data, err } = await getPendingChannels()

      if (!ok || data === undefined || err !== undefined) {
        return res.status(200).json({ ok: false, err })
      }

      const { pending_open_channels: channels } = data

      if (!Array.isArray(channels)) {
        console.log('channels is not an array:', channels)
        return res.status(500).end() 
      }

      const pending = channels.filter((e : any) => e.channel.remote_node_pub === pubkey)[0] ?? undefined

      if (pending !== undefined) {
        status = 'pending'
        txid   = pending.channel
      }

      console.log('pending:', pending)
    }

    return res.status(200).json({ ok: true, data: { txid, status } })
  } catch(err) {
    console.error(err)
    res.status(500).end()
  }
}

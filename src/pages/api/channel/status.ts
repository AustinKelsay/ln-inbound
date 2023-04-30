import type { NextApiRequest, NextApiResponse } from 'next'

import { withSessionRoute } from '@/lib/sessions'
import { getChannels } from '@/lib/lnd'

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

    const { ok, data, err } = await getChannels()

    if (!ok || data === undefined) {
      return res.status(200).json({ ok: false, ...data, err })
    }

    const { channels } = data

    if (!Array.isArray(channels)) {
      console.log('channels is not an array:', channels)
     return res.status(500).end() 
    }

    const channel = channels.filter((e : any) => e.remote_pubkey === pubkey)[0] ?? {}

    console.log('channel:', channel)

    return res.status(200).json({ok: true, data: channel })
  } catch(err) { 
    console.error(err)
    res.status(500).end() 
  }
}

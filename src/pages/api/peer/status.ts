import type { NextApiRequest, NextApiResponse } from 'next'

import { getPeers }         from '@/lib/lnd'
import { withSessionRoute } from '@/lib/sessions'
import { normalizeParams }  from '@/lib/utils'

export default withSessionRoute(handler)

async function handler (
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { pubkey } = normalizeParams(req.query)

    const { ok, data, err } = await getPeers()

    if (!ok || err !== undefined || data === undefined) {
      return res.status(200).json({ ok: false, data, err })
    }

    const { peers } = data

    if (!Array.isArray(peers)) {
      console.log('peers is not an array:', peers)
     return res.status(500).end() 
    }

    const peer = peers.filter((e : any) => e.pub_key === pubkey)[0] ?? undefined

    if (peer?.pub_key !== pubkey) {
      return res.status(200).json({ ok: true, data: { connected: false }})
    }

    req.session.pubkey = peer.pub_key
    await req.session.save()

    console.log('session:', req.session)

    return res.status(200).json({ ok: true, data: { connected: true }})
  } catch(err) { 
    console.error(err)
    res.status(500).end() 
  }
}

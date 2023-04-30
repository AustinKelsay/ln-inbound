import type { NextApiRequest, NextApiResponse } from 'next'

import { addPeer } from '@/lib/lnd'
import { normalizeParams } from '@/lib/utils'

export default async function handler (
  req: NextApiRequest,
  res: NextApiResponse
) {
  
  try {
    const { pubkey, host } = normalizeParams(req.query)

    if (
      typeof pubkey !== 'string' || 
      typeof host !== 'string'
    ) {
      return res.status(400)
    }

    const { ok, data, status = 500 , err } = await addPeer(pubkey, host)

    if (!ok) {
      return res.status(status).json({ ok: false, ...data })
    }

    return res.status(200).json({ ok: true, ...data })
  } catch(err) { 
    console.error('err:', err)
    res.status(500).end()
  }
}

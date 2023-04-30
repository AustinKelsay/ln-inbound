import type { NextApiRequest, NextApiResponse } from 'next'

import { openChannel } from '@/lib/lnd'

export default async function handler (
  req: NextApiRequest,
  res: NextApiResponse
) {
  
  try {
    const { pubkey } = req.session

    if (pubkey === undefined) {
      return res.status(200).json({ ok: false, err: 'Session has expired!' })
    }

    const amount = 25000

    const { ok, data, status = 500 , err } = await openChannel(pubkey, amount)

    if (!ok) {
      return res.status(status).json({ ok: false, ...data, err })
    }

    const {funding_txid_bytes, output_index } = data

    return res.status(200).json({ ok: true, data: { txid: funding_txid_bytes, vout: output_index } })
  } catch(err) { 
    console.error('err:', err)
    res.status(500).end()
  }
}

import type { NextApiRequest, NextApiResponse } from 'next'

import { openChannel } from '@/lib/lnd'

export default async function handler (
  req: NextApiRequest,
  res: NextApiResponse
) {
  
  try {
    const { pubkey, invoice } = req.session

    if (pubkey === undefined || invoice === undefined) {
      return res.status(200).json({ ok: false, err: 'Session has expired!' })
    }

    if (!invoice.paid) {
      return res.status(200).json({ ok: false, err: 'Invoice has not been paid!' })
    }

    const amount = 25000

    const { ok, data, status = 500 , err } = await openChannel(pubkey, amount)

    if (!ok) {
      return res.status(status).json({ ok: false, ...data, err })
    }

    const { funding_txid_bytes, output_index } = data
    const opentx = { txid: funding_txid_bytes, vout: output_index }

    req.session.opentx = opentx
    await req.session.save()

    return res.status(200).json({ ok: true, data: opentx })
  } catch(err) { 
    console.error('err:', err)
    res.status(500).end()
  }
}

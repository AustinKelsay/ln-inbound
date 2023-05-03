import type { NextApiRequest, NextApiResponse } from 'next'

import { lookupInvoice }    from '@/lib/lnd'
import { withSessionRoute } from '@/lib/sessions'

export default withSessionRoute(handler)

async function handler (
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') res.status(400).end()

  try {
    const { pubkey, invoice } = req.session

    if (pubkey === undefined) {
      return res.status(200).json({ ok: false, err: 'Session has expired!' })
    }

    if (invoice?.hash === undefined) {
      return res.status(200).json({ ok: false, err: 'There is no invoice!' })
    }

    const { ok, data, err } = await lookupInvoice(invoice.hash)

    console.log('invoice:', data)

    if (!ok || data === undefined || err !== undefined) {
      return res.status(200).json({ ok: false, data, err })
    }

    if (data.settled) {
      if (req.session.invoice === undefined) {
        console.error('Invoice should not be undefined!')
        return res.status(500).end()
      }
      req.session.invoice.paid = true
      await req.session.save()
    }

    return res.status(200).json({ ok: true, data })

  } catch(err) {
    console.error(err)
    res.status(200).json({ ok: false, err: 'Internal server error.' })
  }
}

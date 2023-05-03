import type { NextApiRequest, NextApiResponse } from 'next'

import { cancelInvoice }    from '@/lib/lnd'
import { withSessionRoute } from '@/lib/sessions'

export default withSessionRoute(handler)

async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') res.status(400).end()

  try {
    const { invoice } = req.session

    if (invoice?.hash === undefined) {
      return res.status(200).json({ ok: true })
    }

    await cancelInvoice(invoice.hash)

    req.session.chsize  = 0
    req.session.invoice = undefined
    
    await req.session.save()

    return res.status(200).json({ ok: true })
  } catch(err) {
    console.log(err)
    res.status(200).json({ ok: false, err: 'Internal server error.' })
  }
}

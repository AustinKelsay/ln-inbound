import type { NextApiRequest, NextApiResponse } from 'next'

import { lookupInvoice }    from '@/lib/lnd'
import { withSessionRoute } from '@/lib/sessions'

export default withSessionRoute(handler)

async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') res.status(400).end()

  try {
    const { pending } = req.session

    if (pending === undefined) {
      return res.status(200).json({ ok: false, err: 'Session has expired!' })
    }

    const { hash } = pending ?? {}

    const { ok, data, err } = await lookupInvoice(hash)

    if (!ok || err !== undefined) {
      return res.status(200).json({ ok: false, ...data, err })
    }

    if (data === undefined) {
      return res.status(200).json({ ok: false, err: 'Invoice not found!' })
    }

    return res.status(200).json({ ok: false, data })

  } catch(err) {
    console.error(err)
    res.status(200).json({ ok: false, err: 'Internal server error.' })
  }
}
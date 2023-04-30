import type { NextApiRequest, NextApiResponse } from 'next'

import { normalizeParams }  from '@/lib/utils'
import { withSessionRoute } from '@/lib/sessions'
import { createInvoice }    from '@/lib/lnd'

type DataResponse = {
  ok    : boolean
  data ?: Record<string, string | number | boolean | null>
  err  ?: unknown
}

export default withSessionRoute(handler)

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<DataResponse>
) {

  // Reject all methods other than GET.
  if (req.method !== 'GET') res.status(400).end()

  // Grab the slug and url from the post body.
  const { pubkey } = normalizeParams(req.query)

  if (pubkey === undefined) {
    return res.status(200).json({ ok: false, err: 'Invalid request!' })
  }

  try {
    const amount = 10000

    const memo = `${pubkey} paid for a channel`

    const { ok, data, err } = await createInvoice({ amount, memo })

    if (!ok || data === undefined || err !== undefined) {
      return res.status(200).json({ ok: false, ...data, err })
    }

    if (data === undefined) {
      throw 'Create invoice returned undefined.'
    }

    const { payment_request, r_hash: hash } = data

    if (payment_request === undefined || hash === undefined) {
      return res.status(200).json({ ok: false, err: 'Error fetching invoice from server!' })
    }

    req.session.pubkey  = pubkey
    req.session.invoice = { paid: false, hash, amount, receipt: payment_request }
    
    await req.session.save()

    if (payment_request === undefined) {
      return res.status(200).json({ ok: false, err: 'Error fetching invoice from server!' })
    }

    return res.status(200).json({ ok: true, data: payment_request })
  } catch(err) {
    console.log(err)
    res.status(200).json({ ok: false, err: 'Internal server error.' })
  }
}

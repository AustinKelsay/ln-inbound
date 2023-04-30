import type { NextApiRequest, NextApiResponse } from 'next'

import { normalizeParams }  from '@/lib/utils'
import { withSessionRoute } from '@/lib/sessions'
import { createInvoice }    from '@/lib/lnd'
import { getRates } from '@/lib/rates'

type DataResponse = {
  ok    : boolean
  data ?: any
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
  const { pubkey, amount } = normalizeParams(req.query)

  if (pubkey === undefined || amount === undefined) {
    return res.status(200).json({ ok: false, err: 'Invalid request!' })
  }

  try {
    const amt = Number(amount)

    const { ok: ok1, data: data1, err: err1 } = await getRates()

    if (!ok1 || data1 === undefined || err1 !== undefined) {
      return res.status(200).json({ ok: false, data: data1, err: err1 })
    }

    const { max_size, fee_rate, base_fee } = data1

    if (amt > max_size) {
      return res.status(200).json({ ok: false, err: 'Amount exceeds max channel size!' })
    }

    const charge = (amt * fee_rate) + base_fee

    const memo = `${pubkey} paid for a channel`

    const { ok, data, err } = await createInvoice({ amount: charge, memo })

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
    req.session.invoice = { paid: false, hash, receipt: payment_request }

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

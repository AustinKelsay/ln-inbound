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
    const { pending } = req.session

    if (pending === undefined) {
      return res.status(200).json({ err: 'Session has expired!' })
    }

    const { hash } = pending ?? {}

    await cancelInvoice(hash)

    req.session.destroy()

    return res.status(200).json({ success: true })
  } catch(err) {
    console.log(err)
    res.status(200).json({ err: 'Internal server error.' })
  }
}

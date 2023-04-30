import type { NextApiRequest, NextApiResponse } from 'next'

import { getInfo } from '@/lib/lnd'

export default async function handler (
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { ok, data, err } = await getInfo()

    if (!ok || data === undefined || err !== undefined) {
      return res.status(200).json({ ok: false, ...data, err })
    }

    return res.status(200).json(data)
  } catch(err) { 
    console.error(err)
    res.status(500).end() 
  }
}

import type { NextApiRequest, NextApiResponse } from 'next'

import { getCollection }   from '@/lib/controller'
import { PubModel }        from '@/model/PubSchema'
import { normalizeParams } from '@/lib/utils'

export default async function handler (
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { nickname } = normalizeParams(req.query)

  if (nickname === undefined) {
    return res.status(404).end()
  }

  try {
    const pubkeys = await getCollection(PubModel)
    const record  = await pubkeys.findOne({ name: nickname })

    if (record === null) {
      return res.status(200).json({ isAvailable: true, record: {} })
    }

    return res.status(200).json({ isAvailable: false, record })
  } catch(err) { 
    console.error(err)
    res.status(500).end() 
  }
}

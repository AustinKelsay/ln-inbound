import type { NextApiRequest, NextApiResponse } from 'next'

import { getPeers } from '@/lib/lnd'

export default async function handler (
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { pubkey } = req.query

    const { ok, data, err } = await getPeers()

    if (!ok || data === undefined) {
      return res.status(200).json({ ok: false, ...data, err })
    }

    const { peers } = data

    if (!Array.isArray(peers)) {
      console.log('peers is not an array:', peers)
     return res.status(500).end() 
    }

    const peer = peers.filter((e : any) => e.pub_key === pubkey)[0] ?? {}

    return res.status(200).json(peer)
  } catch(err) { 
    console.error(err)
    res.status(500).end() 
  }
}

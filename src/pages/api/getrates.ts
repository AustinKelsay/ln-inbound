import type { NextApiRequest, NextApiResponse } from 'next'

import { config } from '@/config'

export default async function handler (
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { max_chansize, fee_rate, base_fee } = config
  try {
    return res.status(200).json({ max_chansize, fee_rate, base_fee })
  } catch(err) { 
    console.error(err)
    res.status(500).end() 
  }
}

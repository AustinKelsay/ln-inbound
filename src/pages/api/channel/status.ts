import type { NextApiRequest, NextApiResponse } from 'next'
import { withSessionRoute } from '@/lib/sessions'
import { getUserOpenChannels, getUserPendingChannels } from '@/lib/api'

export default withSessionRoute(handler)

async function handler (
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { pubkey } = req.session

    if (pubkey === undefined) {
      return res.status(200).json({ ok: false, err: 'Session has expired!' })
    }

    const open_channels = await getUserOpenChannels(pubkey)

    if (!open_channels.ok) {
      const { data, err } = open_channels
      return res.status(200).json({ ok: false, ...data, err })
    }

    const pend_channels = await getUserPendingChannels(pubkey)

    if (!pend_channels.ok) {
      const { data, err } = pend_channels
      return res.status(200).json({ ok: false, ...data, err })
    }

    const data = {
      open    : open_channels.data,
      pending : pend_channels.data
    }

    return res.status(200).json({ ok: true, data })
  } catch(err) { 
    console.error(err)
    res.status(500).end() 
  }
}

// user_channels = channels.filter((e : any) => e.channel.remote_node_pub === pubkey)

// if (user_channels !== undefined) {
//   channel = channel.channel
// }

// if (channel !== undefined) {
//   channel = channel.channel_point.split(':')[0]
// }

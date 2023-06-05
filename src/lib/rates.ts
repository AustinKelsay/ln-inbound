import { getBalance } from '@/lib/lnd'
import { config }     from '@/config'
import { getFees }    from '@/lib/api'

interface ChainFees {
	fastestFee  : number,
	halfHourFee : number,
	hourFee     : number,
	economyFee  : number,
	minimumFee  : number
}

interface FeeRates {
  max_size    : number
  base_fee    : number
  sats_fee    : number
  chan_vbytes : number
  chain_fees  : ChainFees
}

export async function getRates () : Promise<{ ok : boolean, data : FeeRates, err?: unknown }> {
  const { min_reserve, max_chansize, base_fee, sats_fee, chan_vbytes } = config

  const { ok, data, err } = await getBalance()

  if (!ok || data === undefined || err !== undefined) {
    return { ok: false, ...data, err }
  }

  const { confirmed_balance } = data

  const available_balance = Number(confirmed_balance) - Number(min_reserve)

  let max_size

  max_size = Math.min(available_balance, max_chansize)
  max_size = Math.max(max_size, 0)

  const chain_fees = await getFees() as ChainFees

  return { ok: true, data: { max_size, base_fee, sats_fee, chan_vbytes, chain_fees }}
}
import { getBalance } from '@/lib/lnd'
import { config }     from '@/config'

interface FeeRates {
  max_size : number
  fee_rate : number
  base_fee : number
}

export async function getRates () : Promise<{ ok : boolean, data : FeeRates, err?: unknown }> {
  const { min_reserve, max_chansize, fee_rate, base_fee } = config

  const { ok, data, err } = await getBalance()

  if (!ok || data === undefined || err !== undefined) {
    return { ok: false, ...data, err }
  }

  const { confirmed_balance } = data

  const max_size = Math.max(Math.min(Number(confirmed_balance) - min_reserve, max_chansize), 0)

  return { ok: true, data: { max_size, fee_rate, base_fee }}
}
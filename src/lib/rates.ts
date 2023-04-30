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

  console.log('balance:', confirmed_balance)

  const available_balance = Number(confirmed_balance) - Number(min_reserve)

  let max_size

  max_size = Math.min(available_balance, max_chansize)
  max_size = Math.max(max_size, 0)

  return { ok: true, data: { max_size, fee_rate, base_fee }}
}
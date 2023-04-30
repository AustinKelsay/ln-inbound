export const config = {
  lnd_hostname : process.env.LND_HOSTNAME,
  lnd_macaroon : process.env.LND_MACAROON,
  base_fee     : process.env.BASE_FEE,
  fee_rate     : process.env.FEE_RATE,
  min_reserve  : process.env.MIN_RESERVE,
  max_chansize : process.env.MAX_CHANSIZE
}

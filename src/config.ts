export const config = {
  lnd_hostname : process.env.LND_HOSTNAME,
  lnd_macaroon : process.env.LND_MACAROON,
  base_fee     : Number(process.env.BASE_FEE),
  fee_rate     : Number(process.env.RATE_FEE),
  min_reserve  : Number(process.env.MIN_RESERVE),
  max_chansize : Number(process.env.MAX_CHANSIZE)
}

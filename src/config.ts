const {
  LND_HOSTNAME,
  LND_MACAROON,
  BASE_FEE,
  SATS_FEE,
  MIN_RESERVE,
  MAX_CHANSIZE,
  CHAN_VBYTES
} = process.env

export const config = {
  lnd_hostname : LND_HOSTNAME,
  lnd_macaroon : LND_MACAROON,
  base_fee     : Number(BASE_FEE     || 5000),
  sats_fee     : Number(SATS_FEE     || 0),
  min_reserve  : Number(MIN_RESERVE  || 0),
  max_chansize : Number(MAX_CHANSIZE || 25000),
  chan_vbytes  : Number(CHAN_VBYTES  || 500)
}

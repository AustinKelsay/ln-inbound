export const config = {
  lnd_hostname : process.env.LND_HOSTNAME,
  lnd_macaroon : process.env.LND_MACAROON,
  domain_name  : process.env.DOMAIN_NAME  || 'http://localhost:3000',
  site_name    : process.env.SITE_NAME    || 'pubkey.club',
  sub_cost     : 200
}

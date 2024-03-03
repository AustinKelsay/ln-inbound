# Lightning Inbound

## Currently under development updates 🚧

Simple SPA that let's you sell channels and inbound liquidity from your lightning node.  

Built for the Bitcoin++ ATX 2023 hackathon.

In loving memory of zero fee routing (RIP).  

## Getting Started

This project is meant to be forked and deployed with ease.

### Deploy to Vercel

You can one-click deploy this project to vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FAustinKelsay%2Fln-inbound&env=LND_HOSTNAME,LND_MACAROON,SESSION_KEY,BASE_FEE,RATE_FEE,MIN_RESERVE,MAX_CHANSIZE&envDescription=Check%20out%20the%20repo%20documentation%20to%20learn%20more%20about%20how%20to%20configure%20these%20variables&envLink=https%3A%2F%2Fgithub.com%2FAustinKelsay%2Fln-inbound&project-name=my-lightning-inbound&repository-name=my-lightning-inbound)

Make sure to configure your environment variables.

### Host Your Own

Configure your variables in `.env.local` or `config.ts`.

Check out the `env.sample` file for an example of what to do:

```conf
## The full URI to connect to your lightning node.
LND_HOSTNAME=protocol://hostname:port
## The hex-encoded admin macaroon for your lightning node.
LND_MACAROON=hex_encoded_admin_macaroon
## A random 32-byte hex-encoded key (for encrypting session data).
SESSION_KEY=32_byte_hex_encoded_random_key

BASE_FEE=25000        ## The base fee (in sats) to charge for a channel.
RATE_FEE=1            ## The percentage fee (channel size * rate fee) to charge.
MIN_RESERVE=50000     ## The minimum reserve balance to keep on-chain.
MAX_CHANSIZE=1000000  ## The absolute max channel size allowed.
```

Start the production server:

```bash
npm run start
# or
yarn start
```

## Development

Run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Bugs / Issues

Feel free to submit an issue if you run into any bugs or have a question.

## Contribution

Anyone can contribute to this project! 

## Resources

**LND REST API Documentation**  
https://lightning.engineering/api-docs/api/lnd/rest-endpoints


import { withIronSessionApiRoute, withIronSessionSsr } from 'iron-session/next'
import { NextApiHandler } from 'next'
import { getRandString }  from './utils'

declare module 'iron-session' {
  interface IronSessionData {
    [ k : string ] : Record<string, any>
  }
}

if (process.env.SESSION_KEY === undefined) {
  throw 'Session key is not set! Here is a random key for your to use:\n' + getRandString()
}

const sessionOptions = {
  password      : process.env.SESSION_KEY,
  cookieName    : process.env.SESSION_NAME || 'iron-session',
  cookieOptions : {
    secure: process.env.NODE_ENV === "production",
  },
}

export function withSessionRoute(handler : NextApiHandler) {
  return withIronSessionApiRoute(handler, sessionOptions);
}

export function withSessionSsr(handler : any) {
  return withIronSessionSsr(handler, sessionOptions);
}

import { useState } from 'react'
import useSWR        from 'swr'
import { setInvoice } from "@/redux/rootReducer";
import { useSelector, useDispatch } from "react-redux";

const fetcher = (
  input: RequestInfo | URL, 
  init?: RequestInit | undefined
) => fetch(input, init).then(res => res.json())

export function usePeerStatus(pubkey : string) {
  const { data, error, isLoading } = useSWR(`/api/peer/status?pubkey=${pubkey}`, fetcher)
  if (!data) return { error, isLoading }
  if (!data.ok) return { error: data.err }
  return { data: data.data }
}

export function useChannelStatus() {
  const { data, error, isLoading } = useSWR(`/api/channel/status`, fetcher)
  if (!data) return { error, isLoading }
  if (!data.ok) return { error: data.err }
  return { data: data.data }
}

export async function fetchInvoice(pubkey : string, amount : number) {
  const request = {
    method   : "POST",
    headers  : { "Content-Type": "application/json" },
    body     : JSON.stringify({ pubkey, amount })
  }

  const res = await fetch('/api/invoice/request', request)

  if (!res.ok) {
    return { error : `${res.status} error: ${res.statusText}` }
  }

  const { ok, data, err } = await res.json()

  if (!ok || data === undefined || err !== undefined) {
    return { error: err }
  }

  return { ok, data }
}

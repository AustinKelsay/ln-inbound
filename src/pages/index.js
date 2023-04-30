import React, { useState, useEffect } from "react";
import Connect from "@/components/Connect";
import Amount from "@/components/Amount";
import Invoice from "@/components/Invoice";
import { useSelector } from "react-redux";
import Trail from "@/components/Trail"

export default function Home() {
  const invoicePolling = useSelector((state) => state.polling);
  
  const [open, setOpen] = useState(false)

  useEffect(() => {
    setTimeout(() => {
      setOpen(true)
    }, 250)
  }, [])

  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-even p-12`}
    >
      <div className={`w-full`} style={{ minHeight: 100, display: 'flex', justifyContent: 'center' }}>
        <Trail open={open}>
          <span className={`text-5xl font-bold`}>LN Inbound</span>
        </Trail>
      </div>  
      <Amount />
      {invoicePolling && <Invoice />}
      <Connect />
    </main>
  );
}

import React, { useState, useEffect } from "react";
import Connect from "@/components/Connect";
import Amount from "@/components/Amount";
import Invoice from "@/components/Invoice";
import Trail from "@/components/Trail";
import PendingChannel from "@/components/PendingChannel";
import NodeInfo from "@/components/NodeInfo";
import OpeningChannel from "@/components/OpeningChannel";
import { useSelector } from "react-redux";

const mockNodeInfo = {
  identity_pubkey:
    "03298ea87f45bd5294f8052948564b68da378fa640267c7955128f35ee1ad6a064",
  alias: "alice",
  uris: [
    "03298ea87f45bd5294f8052948564b68da378fa640267c7955128f35ee1ad6a064@172.20.0.4:9735",
  ],
};

export default function Home() {
  const invoicePolling = useSelector((state) => state.polling);
  const connected = useSelector((state) => state.connected);
  const txid = useSelector((state) => state.txid);
  const paid = useSelector((state) => state.paid);

  const [open, setOpen] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setOpen(true);
    }, 250);
  }, []);

  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-even p-12`}
    >
      <div
        className={`w-full`}
        style={{
          minHeight: 50,
          display: "flex",
          justifyContent: "center",
          marginBottom: "2rem",
        }}
      >
        <Trail open={open}>
          <span className={`text-5xl font-bold`}>Lightning Inbound</span>
        </Trail>
      </div>

      <p>Serving inbound channels to the plebs.</p>
      <br></br>


      <NodeInfo {...mockNodeInfo} />

      {!invoicePolling && !paid && (
        <>
          <Connect />
          {connected && <Amount />}
        </>
      )}

      {invoicePolling && <Invoice />}

      {paid && !invoicePolling && !txid && <OpeningChannel />}

      {txid && !invoicePolling && <PendingChannel />}
    </main>
  );
}

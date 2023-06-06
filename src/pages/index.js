import React, { useState, useEffect } from "react";
import Connect from "@/components/Connect";
import Amount from "@/components/Amount";
import Invoice from "@/components/Invoice";
import Trail from "@/components/Trail";
import PendingChannel from "@/components/PendingChannel";
import NodeInfo from "@/components/NodeInfo";
import OpeningChannel from "@/components/OpeningChannel";
import { useSelector } from "react-redux";

export default function Home() {
  const invoicePolling = useSelector((state) => state.polling);
  const connected = useSelector((state) => state.connected);
  const channels = useSelector((state) => state.channels);
  const paid = useSelector((state) => state.paid);

  const [open, setOpen] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setOpen(true);
    }, 250);
  }, []);

  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-even p-12 pt-5`}
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
      <NodeInfo />
      {!invoicePolling && !paid && (
        <>
          <Connect />
          {!channels && connected && <Amount />}
        </>
      )}
      {!channels && invoicePolling && <Invoice />}
      {paid && !invoicePolling && !channels && <OpeningChannel />}
      {channels?.length && !invoicePolling && <PendingChannel />} */}
      <h1>Check back in soon</h1>
    </main>
  );
}

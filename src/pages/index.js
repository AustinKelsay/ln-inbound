import React, { useState } from "react";
import Connect from "@/components/Connect";
import Amount from "@/components/Amount";
import Invoice from "@/components/Invoice";

export default function Home() {
  const [invoicePolling, setInvoicePolling] = useState(false);

  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-even p-12`}
    >
      <h1>Hello lninbound</h1>
      <Connect />
      <Amount
        invoicePolling={invoicePolling}
        setInvoicePolling={setInvoicePolling}
      />
      {invoicePolling && <Invoice setInvoicePolling={setInvoicePolling} />}
    </main>
  );
}

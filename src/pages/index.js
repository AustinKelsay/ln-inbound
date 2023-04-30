import React from "react";
import Connect from "@/components/Connect";
import Amount from "@/components/Amount";

export default function Home() {
  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-even p-24`}
    >
      <h1>Hello lninbound</h1>
      <Connect />
      <Amount />
    </main>
  );
}

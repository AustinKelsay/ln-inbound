import React, { useState, useEffect } from "react";

const NodeInfo = () => {
  const [nodeInfo, setNodeInfo] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("/api/getinfo");
      const data = await response.json();
      setNodeInfo(data);
    };

    fetchData();
  }, []);

  const parseHost = () => {
    return nodeInfo.uris[0].split("@")[1];
  };

  return (
    <div className="text-xl">
      {nodeInfo ? (
        <>
          <div>Pubkey: {nodeInfo.identity_pubkey}</div>
          <div>Alias: {nodeInfo.alias}</div>
          <div>Host: {parseHost()}</div>
        </>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default NodeInfo;

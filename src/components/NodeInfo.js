import React, { useState, useEffect } from "react";
import { Button } from "@chakra-ui/react";

const NodeInfo = () => {
  const [nodeInfo, setNodeInfo] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`/api/getinfo`);
      const data = await response.json();
      setNodeInfo(data.data);
    };

    fetchData();
  }, []);

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      alert("Copied to clipboard");
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <div className="text-xl">
      {nodeInfo ? (
        nodeInfo.map((info, index) => (
          <div className="w-2/4 m-auto" key={info}>
            <span className="font-bold">Node URI</span>
            <br />
            {info}
            <Button
              size="sm"
              colorScheme="blue"
              onClick={() => copyToClipboard(info)}
              mt={1}
            >
              Copy
            </Button>
          </div>
        ))
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default NodeInfo;

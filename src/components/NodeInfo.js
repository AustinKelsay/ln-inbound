import React, { useState, useEffect } from "react";
import { Button, Box, Code, Text } from "@chakra-ui/react";

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
          <Box className="w-3/4 m-auto" key={info}>
            <Text fontSize="lg" fontWeight="bold">
              Step 1: Add our node as a peer
            </Text>
            <Code display="block" whiteSpace="pre-wrap" p={2} my={2}>
              {info}
            </Code>
            <Button
              size="sm"
              colorScheme="blue"
              onClick={() => copyToClipboard(info)}
            >
              Copy
            </Button>
          </Box>
        ))
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default NodeInfo;

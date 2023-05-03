import React from "react";
import { Text, VStack, Button, Code } from "@chakra-ui/react";
import { useSelector } from "react-redux";

const PendingChannel = () => {
  const amount = useSelector((state) => state.amount);
  const txid = useSelector((state) => state.txid);
  return (
    <VStack mt={10} alignItems="center" justifyContent="center" spacing={4}>
      <Text fontSize="l" fontWeight="bold">
        Your {amount} sat channel is confirming
      </Text>
      <Code display="block" whiteSpace="pre-wrap" p={2} my={2}>
        Txid: {txid}
      </Code>
      <Button colorScheme={"blue"}>
        <a
          href={`https://mempool.space/tx/${txid}`}
          target="_blank"
          rel="noreferrer"
        >
          View on mempool.space
        </a>
      </Button>
    </VStack>
  );
};

export default PendingChannel;

import React, { useEffect } from "react";
import { Text, VStack, Button, Code } from "@chakra-ui/react";
import { useSelector, useDispatch } from "react-redux";
import { setChannels } from "@/redux/rootReducer";

const PendingChannel = () => {
  const dispatch = useDispatch();

  const amount = useSelector((state) => state.amount);
  const txid = useSelector((state) => state.txid);

  useEffect(() => {
    const channelStatus = async () => {
      try {
        const response = await fetch("/api/channel/status");
        const data = await response.json();
        console.log("channelStatus", data);

        if (data.ok && data.data) {
          dispatch(setChannels(...data.data.pending, ...data.data.open));
        }
      } catch (error) {
        console.error(error);
      }
    };

    const intervalId = setInterval(() => {
      channelStatus();
    }, 5000); // Polls every 5 seconds

    return () => {
      clearInterval(intervalId); // Clean up the interval on unmount
    };
  }, []);

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

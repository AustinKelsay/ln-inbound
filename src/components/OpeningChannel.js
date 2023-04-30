import React, { useEffect } from "react";
import { Text, Spinner, Center } from "@chakra-ui/react";
import { useDispatch } from "react-redux";
import { setTxId } from "@/redux/rootReducer";

const PendingChannel = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/channel/open");
        const data = await response.json();

        if (data.ok && data.txid) {
          dispatch(setTxId(data.txid));
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const channelStatus = async () => {
      try {
        const response = await fetch("/api/channel/status");
        const data = await response.json();
        console.log(data);

        if (data.ok && data.data && data.data.channel_point) {
          dispatch(setTxId(data.data.channel_point));
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
    <Center flexDirection="column" alignItems="center">
      <Spinner
        thickness="4px"
        speed="0.65s"
        emptyColor="gray.200"
        color="blue.500"
        size="xl"
      />
      <Text mt={2}>Opening Channel</Text>
    </Center>
  );
};

export default PendingChannel;

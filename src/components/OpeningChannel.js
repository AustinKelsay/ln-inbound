import React, { useEffect } from "react";
import { Text, Spinner, Center } from "@chakra-ui/react";

const PendingChannel = () => {
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/channel/open");
        const data = await response.json();
        console.log(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
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

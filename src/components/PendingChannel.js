import React from "react";
import { Box, Text, VStack, Button, Flex, Center } from "@chakra-ui/react";
import { useSelector, useDispatch } from "react-redux";

const PendingChannel = () => {
  const amount = useSelector((state) => state.amount);
  return (
    <VStack mt={10} alignItems="center" justifyContent="center" spacing={4}>
      <Text fontSize="xl" fontWeight="bold">
        Your {amount} sat channel is pending
      </Text>
    </VStack>
  );
};

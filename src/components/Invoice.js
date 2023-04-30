import React, { useState, useEffect } from "react";
import QRCode from "qrcode.react";
import {
  Box,
  Text,
  VStack,
  Button,
  Spinner,
  Flex,
  Center,
} from "@chakra-ui/react";
import { useSelector, useDispatch } from "react-redux";
import { setPolling } from "@/redux/rootReducer";

const Invoice = () => {
  const invoice = useSelector((state) => state.invoice);
  const paid = useSelector((state) => state.paid);
  const dispatch = useDispatch();

  return (
    <VStack mt={10} alignItems="center" justifyContent="center" spacing={4}>
      {paid ? (
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
      ) : (
        <>
          <Text fontSize="xl" fontWeight="bold">
            Invoice
          </Text>
          <Box
            borderWidth="3px"
            borderRadius="md"
            borderStyle="solid"
            borderColor="white"
          >
            <QRCode value={invoice} size={256} />
          </Box>
          <Text fontSize="sm" color="white" w={"10%"}>
            {invoice}
          </Text>
          <Button
            colorScheme={"red"}
            onClick={() => dispatch(setPolling(false))}
          >
            Cancel
          </Button>
        </>
      )}
    </VStack>
  );
};

export default Invoice;

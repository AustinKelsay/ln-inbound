import React, { useState, useEffect } from "react";
import QRCode from "qrcode.react";
import { Box, Text, VStack } from "@chakra-ui/react";
import { useSelector } from "react-redux";

const Invoice = () => {
  const invoice = useSelector((state) => state.invoice);

  return (
    <VStack mt={10} alignItems="center" justifyContent="center" spacing={4}>
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
      <Text fontSize="sm" color="white">
        {invoice}
      </Text>
    </VStack>
  );
};

export default Invoice;

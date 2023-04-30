import React, { useEffect } from "react";
import QRCode from "qrcode.react";
import { Box, Text, VStack, Button } from "@chakra-ui/react";
import { useSelector, useDispatch } from "react-redux";
import { setPolling, setPaid } from "@/redux/rootReducer";

const Invoice = () => {
  const invoice = useSelector((state) => state.invoice);
  const dispatch = useDispatch();

  useEffect(() => {
    let timer;
    const pollPendingInvoice = async () => {
      try {
        const response = await fetch("/api/invoice/pending");
        const data = await response.json();

        if (data.ok && data.data?.settled) {
          dispatch(setPolling(false));

          dispatch(setPaid(true));
        } else {
          timer = setTimeout(pollPendingInvoice, 2000);
        }
      } catch (error) {
        console.error(error);
      }
    };

    pollPendingInvoice();

    return () => {
      clearTimeout(timer);
    };
  }, [dispatch]);

  return (
    <VStack mt={10} alignItems="center" justifyContent="center" spacing={4}>
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
        <Button colorScheme={"red"} onClick={() => dispatch(setPolling(false))}>
          Cancel
        </Button>
      </>
    </VStack>
  );
};

export default Invoice;

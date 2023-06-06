import React, { useState, useEffect } from "react";
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useDispatch } from "react-redux";
import { setConnected, setPubKey, setChannels } from "@/redux/rootReducer";

const Connect = () => {
  const [nodePubkey, setNodePubkey] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const dispatch = useDispatch();

  // useEffect(() => {
  //   const channelStatus = async () => {
  //     try {
  //       const response = await fetch("/api/channel/status");
  //       const data = await response.json();
  //       console.log("here", data);

  //       if (data.ok && data.data) {
  //         dispatch(setTxId(data.data));
  //       }
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   };

  //   channelStatus();
  // }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setMessageType("");

    try {
      const response = await fetch(`/api/peer/status?pubkey=${nodePubkey}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const res = await response.json();

      console.log("rez", res);

      if (res?.data?.connected) {
        setMessage("Connected");
        setMessageType("success");

        dispatch(setConnected(true));

        dispatch(setPubKey(nodePubkey));
      } else {
        setMessage("Not connected");
        setMessageType("error");
      }
    } catch (error) {
      console.log(error);
      setMessage("An error occurred. Please try again.");
      setMessageType("error");
    }

    const res = await fetch("/api/getsession");

    try {
      const response = await fetch("/api/channel/status");
      const data = await response.json();
      console.log("here", data);

      if (data.ok && data.data) {
        dispatch(setChannels(...data.data.pending, ...data.data.open));
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <main
      className={`flex flex-col items-center justify-start p-20 w-full py-5`}
    >
      <form onSubmit={handleSubmit} className={`w-full`}>
        <VStack spacing={4}>
          <FormControl id="node-pubkey">
            <FormLabel>Step 2: Enter your node&apos;s pubkey</FormLabel>
            <Input
              type="text"
              value={nodePubkey}
              onChange={(e) => setNodePubkey(e.target.value)}
            />
          </FormControl>
          <Button type="submit" colorScheme="blue">
            Check connection status
          </Button>
          {message && (
            <Text
              fontWeight="bold"
              color={messageType === "success" ? "green.500" : "red.500"}
            >
              {message}
            </Text>
          )}
        </VStack>
      </form>
    </main>
  );
};

export default Connect;

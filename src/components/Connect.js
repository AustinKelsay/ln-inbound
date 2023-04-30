import React, { useState } from "react";
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Text,
  VStack,
} from "@chakra-ui/react";

const Connect = () => {
  const [nodePubkey, setNodePubkey] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Replace with your API endpoint
      //   const response = await fetch("https://your-api-endpoint.com", {
      //     method: "POST",
      //     body: JSON.stringify({ nodePubkey }),
      //     headers: {
      //       "Content-Type": "application/json",
      //     },
      //   });

      const response = {
        ok: true,
      };

      if (response.ok) {
        setMessage("Connection successful!");
        setMessageType("success");
      } else {
        setMessage("Connection failed");
        setMessageType("error");
      }

      setTimeout(() => {
        setMessage("");
        setMessageType("");
      }, 6000);
    } catch (error) {
      setMessage("An error occurred. Please try again.");
      setMessageType("error");
    }
  };

  return (
    <main className={`flex flex-col items-center justify-start p-20 w-full`}>
      <form onSubmit={handleSubmit} className={`w-full`}>
        <VStack spacing={4}>
          <FormControl id="node-pubkey">
            <FormLabel>Node Pubkey</FormLabel>
            <Input
              type="text"
              value={nodePubkey}
              onChange={(e) => setNodePubkey(e.target.value)}
            />
          </FormControl>
          <Button type="submit" colorScheme="blue">
            Connect
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

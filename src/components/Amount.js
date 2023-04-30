import React, { useState } from "react";
import {
  Box,
  Button,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  SliderMark,
} from "@chakra-ui/react";

const Amount = ({ invoicePolling, setInvoicePolling }) => {
  const [sliderValue, setSliderValue] = useState(50);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setInvoicePolling(true);
  };

  return (
    <Box w={"100%"}>
      <Slider aria-label="slider-ex-6" onChange={(val) => setSliderValue(val)}>
        <SliderMark
          value={sliderValue}
          textAlign="center"
          bg="blue.500"
          color="white"
          mt="-10"
          ml="-5"
          w="12"
        >
          {sliderValue}%
        </SliderMark>
        <SliderTrack>
          <SliderFilledTrack />
        </SliderTrack>
        <SliderThumb />
      </Slider>
      <Box display="flex" justifyContent="center" mt={4}>
        <Button
          colorScheme="green"
          onClick={handleSubmit}
          isDisabled={invoicePolling}
        >
          Confirm
        </Button>
      </Box>
    </Box>
  );
};

export default Amount;

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
import { useSelector, useDispatch } from "react-redux";
import { setAmount, setPolling } from "@/redux/rootReducer";

const Amount = () => {
  const [sliderAmount, setSliderAmount] = useState(0);
  const invoicePolling = useSelector((state) => state.polling);
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();

    dispatch(setPolling(true));

    dispatch(setAmount(sliderAmount));
  };

  return (
    <Box w={"100%"}>
      <Slider
        aria-label="slider-ex-6"
        value={sliderAmount}
        onChange={(val) => setSliderAmount(val)}
      >
        <SliderMark
          value={sliderAmount}
          textAlign="center"
          bg="blue.500"
          color="white"
          mt="-10"
          ml="-5"
          w="12"
        >
          {sliderAmount}
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

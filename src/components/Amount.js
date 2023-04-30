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
import { setAmount, setPolling, setInvoice } from "@/redux/rootReducer";

const Amount = () => {
  const [sliderValue, setSliderValue] = useState(20000);

  const invoicePolling = useSelector((state) => state.polling);

  const pubkey = useSelector((state) => state.pubkey);

  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch(
      `/api/invoice/request?pubkey=${pubkey}&amount=${sliderValue}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const res = await response.json();

    if (res?.data) {
      dispatch(setPolling(true));

      dispatch(setInvoice(res.data));

      dispatch(setAmount(sliderValue));
    }
  };

  const leftLabelStyles = {
    mt: "4",
    ml: "-7",
    fontSize: "sm",
  };

  const rightLabelStyles = {
    mt: "4",
    ml: "-21",
    fontSize: "sm",
  };

  const addCommas = (num) => {
    const asString = num.toString();

    return asString.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
  };

  return (
    <>
      <Box w={"100%"} className="px-20 pt-20">
        <Slider
          aria-label="slider-ex-6"
          defaultValue={20000}
          min={20000}
          max={100000}
          step={10}
          onChange={(val) => setSliderValue(val)}
        >
          <SliderMark value={20000} {...leftLabelStyles}>
            20,000
          </SliderMark>
          <SliderMark value={100000} {...rightLabelStyles}>
            100,000
          </SliderMark>
          <SliderTrack>
            <SliderFilledTrack />
          </SliderTrack>
          <SliderThumb boxSize={5}>⚡️</SliderThumb>
        </Slider>
      </Box>
      <div
        className={`text-2xl`}
        style={{ display: "flex", marginTop: "2rem" }}
      >
        <div>Sats:</div>
        &nbsp;
        <div>{addCommas(sliderValue)}</div>
      </div>
      <Box display="flex" justifyContent="center" mt={4}>
        <Button
          colorScheme="blue"
          onClick={handleSubmit}
          isDisabled={invoicePolling}
        >
          Confirm
        </Button>
      </Box>
    </>
  );
};

export default Amount;

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
  const [sliderValue, setSliderValue] = useState(10000);

  const invoicePolling = useSelector((state) => state.polling);

  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();

    dispatch(setPolling(true));

    dispatch(setAmount(sliderValue));
  }


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
    const asString = num.toString()

    return asString.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")
  }

  return (
    <>
    <Box w={"100%"} className="px-20 pt-20">
      <Slider aria-label="slider-ex-6"  defaultValue={10000} min={10000} max={100000} step={10} onChange={(val) => setSliderValue(val)}>
        <SliderMark value={10000} {...leftLabelStyles}>
          10,000
        </SliderMark>
        <SliderMark value={100000} {...rightLabelStyles}>
          100,000
        </SliderMark>
        <SliderTrack>
          <SliderFilledTrack />
        </SliderTrack>
        <SliderThumb boxSize={5}>
          ⚡️
        </SliderThumb>
      </Slider>
    </Box>
    <div className={`text-2xl`} style={{display: 'flex', marginTop: '2rem'}}>
      <div>Sats:</div>
      &nbsp;
      <div>{addCommas(sliderValue)}</div>
    </div>
    <Box display="flex" justifyContent="center" mt={4}>
        <Button
          colorScheme="green"
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

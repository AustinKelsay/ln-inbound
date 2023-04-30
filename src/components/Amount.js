import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  SliderMark,
  Tooltip,
  IconButton,
} from "@chakra-ui/react";
import { InfoOutlineIcon } from "@chakra-ui/icons";
import { useSelector, useDispatch } from "react-redux";
import { setAmount, setPolling, setInvoice } from "@/redux/rootReducer";

const Amount = () => {
  const [sliderValue, setSliderValue] = useState(20000);
  const [maxAmount, setMaxAmount] = useState(null);
  const [baseFee, setBaseFee] = useState(null);
  const [feeRate, setFeeRate] = useState(null);

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

  useEffect(() => {
    const fetchRates = async () => {
      try {
        const response = await fetch(`/api/getrates`);
        const data = await response.json();
        console.log(data);

        if (data?.data) {
          setMaxAmount(data.data.max_size);

          setBaseFee(data.data.base_fee);

          setFeeRate(data.data.fee_rate);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchRates();
  }, []);

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

  const addCommas = (value) => {
    let output = "";
    if (typeof value === "number") {
      output = value.toString();
    } else {
      output = value;
    }

    return output ? output.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,") : "";
  };

  const getTotal = () => {
    // The total is the base fee times the fee rate but make sure it is not a decimal number, round up if it is
    if (baseFee && feeRate) {
      const total = baseFee * feeRate;
      if (total % 1 !== 0) {
        return Math.ceil(total);
      }
      return total;
    }
    return null;
  };

  return (
    <>
      <Box w={"100%"} className="px-20 pt-15">
        <Slider
          aria-label="slider-ex-6"
          defaultValue={20000}
          min={20000}
          max={maxAmount}
          step={10}
          onChange={(val) => setSliderValue(val)}
        >
          <SliderMark value={20000} {...leftLabelStyles}>
            20,000
          </SliderMark>
          <SliderMark value={maxAmount} {...rightLabelStyles}>
            {addCommas(maxAmount)}
          </SliderMark>
          <SliderTrack>
            <SliderFilledTrack />
          </SliderTrack>
          <SliderThumb boxSize={5}>⚡️</SliderThumb>
        </Slider>
      </Box>
      <div className="font-bold">
        <span>Base fee: {baseFee} </span>
        <span>Channel Size: {addCommas(sliderValue)} </span>
        <span>Fee rate: {feeRate}</span>
      </div>
      <div
        className={`text-2xl flex-row content-center items-center`}
        style={{ display: "flex", marginTop: "1rem" }}
      >
        <Tooltip
          label="The total cost is calculated as the base fee times the fee rate, rounded up to the nearest integer."
          fontSize="md"
          placement="top"
          hasArrow
        >
          <IconButton
            icon={<InfoOutlineIcon />}
            variant="ghost"
            size="md"
            aria-label="Info about total cost"
          />
        </Tooltip>
        <p>Total</p>
        &nbsp;
        <p>{getTotal()} sats</p>
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

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
  Spinner,
  Center,
  Text,
  RadioGroup,
  Radio,
  Stack,
} from "@chakra-ui/react";
import { InfoOutlineIcon } from "@chakra-ui/icons";
import { useSelector, useDispatch } from "react-redux";
import { setAmount, setPolling, setInvoice } from "@/redux/rootReducer";

const Amount = () => {
  const [sliderValue, setSliderValue] = useState(20000);
  const [maxAmount, setMaxAmount] = useState(null);
  const [baseFee, setBaseFee] = useState(null);
  const [feeRate, setFeeRate] = useState(null);
  const [total, setTotal] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [channelFee, setChannelFee] = useState(null);
  const [feeSelection, setFeeSelection] = useState("hour");
  const [chainFees, setChainFees] = useState({
    minimum: null,
    economy: null,
    hour: null,
    halfHour: null,
    fastest: null,
  });

  const invoicePolling = useSelector((state) => state.polling);

  const pubkey = useSelector((state) => state.pubkey);

  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("totall", total, pubkey);

    const body = {
      pubkey: pubkey,
      amount: total,
    };

    const response = await fetch("/api/invoice/request", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const res = await response.json();

    if (res?.data) {
      dispatch(setPolling(true));
      dispatch(setInvoice(res.data));
      dispatch(setAmount(sliderValue));
    }
  };

  useEffect(() => {
    if (baseFee && feeRate) {
      // tx fee is the channel fee (assumed channel open tx size) * sats/vB
      const txFee = chainFees[feeSelection] * channelFee;
      // Total is channel size * fee rate + baseFee and txFee
      const calculatedTotal = sliderValue * feeRate + baseFee + txFee;
      setTotal(Math.ceil(calculatedTotal));
    }
  }, [sliderValue, baseFee, feeRate, feeSelection]);

  useEffect(() => {
    const fetchRates = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/getrates`);
        const data = await response.json();
        console.log("daaaa", data);

        if (data?.data) {
          setMaxAmount(data.data.max_size);
          setBaseFee(data.data.base_fee);
          setFeeRate(data.data.sats_fee);
          setChannelFee(data.data.chan_vbytes);

          const fees = data.data.chain_fees;

          setChainFees({
            minimum: fees.minimumFee,
            economy: fees.economyFee,
            hour: fees.hourFee,
            halfHour: fees.halfHourFee,
            fastest: fees.fastestFee,
          });

          setIsLoading(false);
        }
      } catch (error) {
        console.log(error);
        setIsLoading(false);
      }
    };
    fetchRates();
  }, []);

  const formatFeeRate = (rate) => {
    return rate ? (rate * 100).toFixed(2) + "%" : "";
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

  const addCommas = (value) => {
    let output = "";
    if (typeof value === "number") {
      output = value.toString();
    } else {
      output = value;
    }

    return output ? output.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,") : "";
  };

  const renderSlider = () => {
    if (total !== null) {
      return (
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
          <SliderThumb style={{ background: "#303030" }} boxSize={6}>
            ⚡️
          </SliderThumb>
        </Slider>
      );
    }
  };

  if (isLoading) {
    return (
      <Center flexDirection="column" alignItems="center">
        <Spinner
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
          color="blue.500"
          size="xl"
        />
        <Text mt={2}>Loading...</Text>
      </Center>
    );
  }

  return (
    <>
      <Box w={"100%"} className="pt-20">
        {renderSlider()}
      </Box>
      <div className="font-bold">
        <span>Base fee: {baseFee} </span>
        <span>Channel Size: {addCommas(sliderValue)} </span>
        <span>Fee rate: {formatFeeRate(feeRate)}</span>
      </div>
      <RadioGroup onChange={setFeeSelection} value={feeSelection}>
        <p className="text-center">Fee selection</p>
        <Stack direction="row" spacing={4}>
          <Button
            colorScheme={feeSelection === "minimum" ? "blue" : "gray"}
            variant={feeSelection === "minimum" ? "solid" : "outline"}
            size="sm"
            onClick={() => setFeeSelection("minimum")}
          >
            minimum {chainFees.minimum} sats/vB
          </Button>
          <Button
            colorScheme={feeSelection === "economy" ? "blue" : "gray"}
            variant={feeSelection === "economy" ? "solid" : "outline"}
            size="sm"
            onClick={() => setFeeSelection("economy")}
          >
            economy {chainFees.economy} sats/vB
          </Button>
          <Button
            colorScheme={feeSelection === "hour" ? "blue" : "gray"}
            variant={feeSelection === "hour" ? "solid" : "outline"}
            size="sm"
            onClick={() => setFeeSelection("hour")}
          >
            average {chainFees.hour} sats/vB
          </Button>
          <Button
            colorScheme={feeSelection === "halfHour" ? "blue" : "gray"}
            variant={feeSelection === "halfHour" ? "solid" : "outline"}
            size="sm"
            onClick={() => setFeeSelection("halfHour")}
          >
            fast {chainFees.halfHour} sats/vB
          </Button>
          <Button
            colorScheme={feeSelection === "fastest" ? "blue" : "gray"}
            variant={feeSelection === "fastest" ? "solid" : "outline"}
            size="sm"
            onClick={() => setFeeSelection("fastest")}
          >
            very fast {chainFees.fastest} sats/vB
          </Button>
        </Stack>
      </RadioGroup>
      <div
        className={`text-2xl flex-row content-center items-center`}
        style={{ display: "flex", marginTop: "1rem" }}
      >
        <Tooltip
          label="The total cost is calculated as the base fee + (channel size * fee rate), rounded up to the nearest integer"
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
        <p>{total} sats</p>
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

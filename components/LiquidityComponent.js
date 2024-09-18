"use client";

import { useEffect, useState, useRef } from "react";
import {
  swapTokenToToken,
  removeLiquidity,
  addLiquidity,
} from "@/utils/context";
import SwapField from "./SwapField";
import TransactionStatus from "./TransactionStatus";
import toast, { Toaster } from "react-hot-toast";
import { toEth, toWei } from "@/utils/utils";
import { DEFAULT_VALUE, WETH, getTokenPairId } from "@/utils/saleToken";
import { useAccount } from "wagmi";
import { Cog, ArrowDown, ArrowUp } from "./index";
import styles from "./cmp.module.css";

const SwapComponent = () => {
  const [srcToken, setSrcToken] = useState(WETH);
  const [destToken, setDestToken] = useState(DEFAULT_VALUE);

  const [inputValue, setInputValue] = useState();
  const [outputValue, setOutputValue] = useState();

  const [lpAmount, setLpAmount] = useState();

  const inputValueRef = useRef();
  const outputValueRef = useRef();

  const isReversed = useRef(false);

  const [currentRef, setCurrentRef] = useState(isReversed.current);

  const ENTER_AMOUNT = "Enter an amount";
  const ENTER_TOKEN = "Select an token";
  const CONNECT_WALLET = "Connect wallet";
  const SWAP = "Swap";

  const srcTokenObj = {
    id: "srcToken",
    value: inputValue,
    setValue: setInputValue,
    defaultValue: srcToken,
    ignoreValue: destToken,
    setToken: setSrcToken,
  };

  const destTokenObj = {
    id: "destToken",
    value: outputValue,
    setValue: setOutputValue,
    defaultValue: destToken,
    ignoreValue: srcToken,
    setToken: setDestToken,
  };

  const [srcTokenComp, setSrcTokenComp] = useState();
  const [destTokenComp, setDestTokenComp] = useState();

  const [swapBtnText, setSwapBtnText] = useState(ENTER_AMOUNT);
  const [txPending, setTxPending] = useState(false);

  const notifyError = (msg) => toast.error(msg, { duration: 6000 });
  const notifySuccess = () => toast.success("Transaction completed.");

  const account = useAccount();

  useEffect(() => {
    //handling the text of the submit
    console.log("mmmmmm");
    console.log(inputValue);
    console.log(outputValue);
    if (!account) {
      setSwapBtnText(CONNECT_WALLET);
    } else if (!inputValue || !outputValue) {
      setSwapBtnText(ENTER_AMOUNT);
    } else if (srcToken === DEFAULT_VALUE || destToken === DEFAULT_VALUE) {
      setSwapBtnText(ENTER_TOKEN);
    } else {
      setSwapBtnText(SWAP);
    }
  }, [inputValue, outputValue, account, srcToken, destToken]);

  useEffect(() => {
    if (
      document.activeElement !== outputValueRef.current &&
      document.activeElement.ariaLabel !== "srcToken" &&
      !isReversed.current
    ) {
      setSrcTokenComp(<SwapField obj={srcTokenObj} ref={inputValueRef} />);
    }
  }, [inputValue, destToken]);

  useEffect(() => {
    if (
      document.activeElement !== inputValueRef.current &&
      document.activeElement.ariaLabel !== "destToken" &&
      !isReversed.current
    ) {
      setDestTokenComp(<SwapField obj={destTokenObj} ref={outputValueRef} />);

      if (isReversed.current) {
        isReversed.current = false;
      }
    }
  }, [outputValue, srcToken]);

  // const handleReverseExchange = (e) => {
  //   isReversed.current = !isReversed.current;
  //   setCurrentRef(isReversed.current);

  //   // swap token (srcToken <=> destToken)
  //   // swap value (inputValue <=> outputValue)
  //   setInputValue(outputValue);
  //   setOutputValue(inputValue);

  //   setSrcToken(destToken);
  //   setDestToken(srcToken);
  // };

  const getSwapBtnClassName = () => {
    let className = "p-4 w-full my-2 rounded-xl";
    className +=
      swapBtnText === ENTER_AMOUNT ||
      swapBtnText === CONNECT_WALLET ||
      swapBtnText === ENTER_TOKEN
        ? " text-zinc-400 bg-zinc-800 pointer-events-none"
        : ` ${styles.bg_iconcc}`;
    return className;
  };

  const addLp = async () => {
    setTxPending(true);
    const receipt = await addLiquidity(
      getTokenPairId(srcToken, destToken),
      inputValue,
      outputValue
    );
    setTxPending(false);

    if (receipt.message) {
      notifyError(receipt.message);
    } else {
      notifySuccess();
    }
  };

  const removeLp = async () => {
    setTxPending(true);
    const receipt = await removeLiquidity(
      getTokenPairId(srcToken, destToken),
      lpAmount
    );
    setTxPending(false);

    if (receipt.message) {
      notifyError(receipt.message);
    } else {
      notifySuccess();
    }
  };

  return (
    <div className="border-[1px] border-[#ffeaa7] bg-[#ffeaa7] w-[500px] p-4 px-6 rounded-xl">
      <div className="flex items-center justify-between py-4 px-1 text-[#212429]">
        <p className="text-xl">Add or remove liquidity</p>
        <Cog />
      </div>
      <div className="relative bg-[#212429] p-4 py-6 rounded-xl mb-2 border-[2px] border-transparent hover:border-zinc-600">
        {srcTokenComp}

        {/* <div
          className="absolute left-1/2 -translate-x-1/2 -border-6 h-10 p-1 bg-[#212429] border-4 border-zinc-900 text-zinc-300 rounded-xl"
          // onClick={handleReverseExchange}
        >
          {!currentRef ? <ArrowDown /> : <ArrowUp />}
        </div> */}
      </div>
      <div className="bg-[#212429] p-4 py-6 rounded-xl mt-2 border-[2px] border-transparent hover:border-zinc-600">
        {destTokenComp}
      </div>
      <button
        className={getSwapBtnClassName()}
        onClick={() => {
          if (swapBtnText === SWAP) {
            addLp();
          }
        }}
      >
        Add Liquidity
      </button>
      <div className="flex justify-between items-center">
        <input
          type={"number"}
          className="w-3/5 outline-none h-14 px-8 appearance-none text-3xl bg-[#212429] p-4 rounded-xl py-4"
          value={lpAmount}
          placeholder={"0.0"}
          onChange={(e) => setLpAmount(e.target.value)}
        />
        <button
          className={`p-4 w-40 my-2 rounded-xl ${styles.bg_iconcc}`}
          onClick={() => {
            removeLp();
          }}
        >
          Remove Liquidity
        </button>
      </div>
      {txPending && <TransactionStatus />}

      <Toaster />
    </div>
  );
};

export default SwapComponent;

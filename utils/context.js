import { BigNumber, ethers } from "ethers";
import { contract, tokenContract } from "./contract";
import { toEth, toWei } from "./utils";
import { COIN_ADDRESS_MAP } from "./saleToken";

function parseErrorMsg(err) {
  console.error(err);
  return err;
}

export async function swapTokenToToken(
  pairId,
  amountIn,
  tokenName,
  minOut = toWei("0.01")
) {
  try {
    const contractObj = await contract();

    const data = await contractObj.swap(
      pairId,
      toWei(amountIn.toString()),
      COIN_ADDRESS_MAP[tokenName],
      minOut
    );

    return data;
  } catch (e) {
    return parseErrorMsg(e);
  }
}

export async function addLiquidity(pairId, amountDesired1, amountDesired2) {
  try {
    const contractObj = await contract();
    const data = await contractObj.addLiquidity(
      pairId,
      toWei(amountDesired1),
      toWei(amountDesired2)
    );

    const receipt = await data.wait();
    return receipt;
  } catch (e) {
    return parseErrorMsg(e);
  }
}

export async function removeLiquidity(pairId, LPAmount) {
  try {
    const contractObj = await contract();
    const data = await contractObj.removeLiquidity(pairId, toWei(LPAmount));

    const receipt = await data.wait();
    return receipt;
  } catch (e) {
    return parseErrorMsg(e);
  }
}

export async function getUserTokenBalance(userAddr, tokenName) {
  try {
    const contractObj = await contract();
    const data = await contractObj.getUserTokenBalance(
      userAddr,
      COIN_ADDRESS_MAP[tokenName]
    );
    return data;
  } catch (e) {
    return parseErrorMsg(e);
  }
}

export async function getSwapHistory(id = 0) {
  try {
    const contractObj = await contract();
    const data = await contractObj.getSwapHistory(id);
    return data;
  } catch (e) {
    return parseErrorMsg(e);
  }
}

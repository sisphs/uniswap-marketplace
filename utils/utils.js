import { ethers } from "ethers";
import Decimal from "decimal.js";

export function toWei(amount, decimals = 18) {
  const toWei = ethers.parseUnits(amount, decimals);
  return toWei;
}

export function toEth(amount, decimals = 18) {
  const toEth = ethers.formatUnits(amount, decimals);
  const decimalNumber = new Decimal(toEth);
  return decimalNumber.toFixed(1); // 保留两位小数
}

export const numberFormat = (number) => {
  return new Intl.NumberFormat().format(Number(number));
};

export const showAddress = (address) => {
  return `${address?.substring(0, 4)}...${address?.substring(
    address.length - 4,
    address.length - 1
  )}`;
};

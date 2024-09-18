import { ethers, Contract } from "ethers";
import CustomSwapABI from "./CustomSwap.json";
import CustomToeknABI from "./CustomToken.json";
import { COIN_ADDRESS_MAP, DEX_ADDRESS } from "./saleToken";

export const tokenContract = async (address) => {
  const provider = new ethers.BrowserProvider(window.ethereum);
  const { ethereum } = window;

  if (ethereum) {
    const signer = await provider.getSigner();

    const contractRead = new Contract(address, CustomToeknABI, signer);
    return contractRead;
  }
};

export const contract = async () => {
  const provider = new ethers.BrowserProvider(window.ethereum);
  const { ethereum } = window;
  if (ethereum) {
    const signer = await provider.getSigner();

    const contractRead = new Contract(DEX_ADDRESS, CustomSwapABI, signer);
    return contractRead;
  }
};

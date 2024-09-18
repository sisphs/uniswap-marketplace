import { ethers } from "ethers";
import toast, { Toaster } from "react-hot-toast";
import {
  Plus,
  ClipboardCheckIcon,
  ClipboardIcon,
  SingleCard,
  TransactionStatus,
} from "@/components/index";

import { DEX_ADDRESS } from "@/utils/saleToken";

Toaster;
const Card = () => {
  return (
    <section className="py-6 sm-py-12 bg-[#1A1A1A] text-gray-100">
      <div className="container p-6 mx-auto space-y-8">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold">All Listed Token For Sale</h2>
          <p className="font-sans text-sm text-gray-100">
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry
          </p>
        </div>
        <div className="grid grid-cols-1 gap-x-4 gap-y-8 md:grid-cols-2 lg:grid-cols-4">
          <SingleCard index={0} name={"WETH"} walletAddress={DEX_ADDRESS} />
          <SingleCard index={1} name={"BNB"} walletAddress={DEX_ADDRESS} />
          <SingleCard index={2} name={"USDC"} walletAddress={DEX_ADDRESS} />
        </div>
      </div>
    </section>
  );
};

export default Card;

"use client";

import { useEffect, useRef } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import toast, { Toaster } from "react-hot-toast";
import { usePathname } from "next/navigation";

// internal import
import { TokenBalance, Logo, Menu } from "./index";

const Header = () => {
  const { address } = useAccount();

  const noreferrer = useRef();

  const pathname = usePathname();

  const getClassName = (value) => {
    if (pathname === value) {
      return "flex items-center px-4 -mb-1 dark:border-transparent hover:text-[#ffeaa7] text-[#ffeaa7] border-[#ffeaa7]";
    }
    return "flex items-center px-4 -mb-1 dark:border-transparent hover:text-[#ffeaa7]";
  };

  const notifyConnectWallet = () => {
    toast.error("Connect Wallet", { duration: 2000 });
  };

  useEffect(() => {
    if (!address) {
      notifyConnectWallet();
    }
  }, [address]);
  return (
    <header className="p-4 text-gray-100">
      <div className="container flex justify-between h-16 mx-auto">
        <div className="flex">
          <a
            className="flex items-center p-2"
            ref={noreferrer}
            href="#"
            aria-label="Back to homepage"
          >
            <Logo />
          </a>
          <ul className="items-stretch hidden space-x-3 lg:flex">
            <li className="flex">
              <a className={getClassName("/")} ref={noreferrer} href="/">
                Swap
              </a>
            </li>
            <li className="flex">
              <a
                className={getClassName("/pool")}
                ref={noreferrer}
                href="/pool"
              >
                Pool
              </a>
            </li>

            <li className="flex">
              <a
                className={getClassName("/history")}
                ref={noreferrer}
                href="/history"
              >
                History
              </a>
            </li>
          </ul>
        </div>
        <div className="lg:flex items-center flex-shrink-0 hidden">
          <TokenBalance name={"WETH"} walletAddress={address} />
          <TokenBalance name={"BNB"} walletAddress={address} />
          <TokenBalance name={"USDC"} walletAddress={address} />
          <ConnectButton />
        </div>
        <button className="lg:hidden p-4">
          {/* 未实现响应式 */}
          <Menu />
        </button>
      </div>
      <Toaster />
    </header>
  );
};

export default Header;

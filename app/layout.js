"use client";

import "../styles/globals.css";

// app/page,js
import merge from "lodash.merge";
import "@rainbow-me/rainbowkit/styles.css";

import { WagmiProvider, http } from "wagmi";
import { mainnet, sepolia } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  getDefaultConfig,
  RainbowKitProvider,
  darkTheme,
  midnightTheme,
} from "@rainbow-me/rainbowkit";

import Image from "next/image";
import { Inter } from "next/font/google";
import Tokens from "./token";
import { Header } from "@/components";

const config = getDefaultConfig({
  appName: "Custom Dex",
  projectId: "837797a9309b96f646cc327278ca80kk",
  chains: [sepolia],
  transports: {
    [sepolia.id]: http(
      "https://sepolia.infura.io/v3/ee1224d32d4a4e11b7d4844f71bc18f9"
    ),
  },
});

const queryClient = new QueryClient();

const myTheme = merge(midnightTheme(), {
  colors: {
    accentColor: "#18181b",
    accentColorForeground: "#fff",
  },
});

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <WagmiProvider config={config}>
          <QueryClientProvider client={queryClient}>
            <RainbowKitProvider theme={myTheme}>
              <div className="bg-[#1A1A1A]">
                <Header />
                {children}
              </div>
            </RainbowKitProvider>
          </QueryClientProvider>
        </WagmiProvider>
      </body>
    </html>
  );
}

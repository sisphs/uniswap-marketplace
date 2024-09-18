export const WETH = "WETH";
export const BNB = "BNB";
export const USDC = "USDC";

export const DEFAULT_VALUE = "Please select";

export const COIN_ADDRESS_MAP = {
  WETH: "0x0741be48AC5c0579FE3ffd018cba9b54580cC583",
  BNB: "0xEfac0868b29FEC99fC82e77510034305Aa776588",
  USDC: "0x3DEC3E48d55ee8206DdEe12c57d64a3902b1C669",
  LP: "0xD35077C44A92378099EF4cDb0d430d4069653889",
};

export const ADDRESS_COIN_MAP = {
  "0x0741be48AC5c0579FE3ffd018cba9b54580cC583": "WETH",
  "0xEfac0868b29FEC99fC82e77510034305Aa776588": "BNB",
  "0x3DEC3E48d55ee8206DdEe12c57d64a3902b1C669": "USDC",
  "0xD35077C44A92378099EF4cDb0d430d4069653889": "LP",
};

// 该合约存在一个问题，资金池没有统一，而是不同币对有不同的资金池，导致LP的计算存在问题。解决方法：1，统一资金池 2，针对不同的池子创建不同的LP
export const DEX_ADDRESS = "0xD35077C44A92378099EF4cDb0d430d4069653889";

const tradingPairs = [
  { id: 1, tokens: ["WETH", "BNB"] },
  { id: 2, tokens: ["WETH", "USDC"] },
  { id: 3, tokens: ["BNB", "USDC"] },
];

export function getTokenPairId(srcToken, destToken) {
  // 遍历所有交易对
  for (const pair of tradingPairs) {
    const [token1, token2] = pair.tokens;
    // 判断代币是否匹配，忽略顺序
    if (
      (srcToken === token1 && destToken === token2) ||
      (srcToken === token2 && destToken === token1)
    ) {
      return pair.id; // 找到匹配的交易对，返回其ID
    }
  }
  return; // 没有找到匹配的交易对
}

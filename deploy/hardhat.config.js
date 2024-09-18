// require("@nomicfoundation/hardhat-toolbox");
// require("@nomicfoundation/hardhat-ignition-ethers");

require("@nomicfoundation/hardhat-verify"); // 该库和上面两个有冲突，如果运行 verify ，将上面两个注释掉。

/** @type import('hardhat/config').HardhatUserConfig */

module.exports = {
  solidity: "0.8.0",
  networks: {
    sepolia: {
      url: "https://sepolia.infura.io/v3/ee1224d32d4a4e11b7d4844f71bc18f9", // Sepolia 网络的 RPC URL
      accounts: [
        "9f8a79c2c481e1bf3dac545e3864fb80e5ea73a76bd1c8487d66b4573fd10354",
      ], // 私钥
      timeout: 200000,
    },
    ganache: {
      url: "http://127.0.0.1:8545",
    },
  },
  etherscan: {
    apiKey: "I74Q8DP9Z8FBVHDEHPEQAXSJ3EBDD3EI9D",
  },
  sourcify: {
    // Disabled by default
    // Doesn't need an API key
    enabled: false,
  },
};

const hre = require("hardhat");

async function main() {
  // 获取部署账户
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // 获取合约
  const CustomDex = await hre.ethers.deployContract("CustomSwap");
  await CustomDex.waitForDeployment();

  console.log(CustomDex.target);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

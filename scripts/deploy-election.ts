import hre, { ethers } from "hardhat";

async function main() {
  const USElection = await ethers.getContractFactory("USElection");
  const usElection = await USElection.deploy();
  const transaction = await usElection.deployed();

  if (hre.network.name == "goerli" || hre.network.name == "sepolia") {
    const transactionReceipt = await transaction.deployTransaction.wait(5);

    if (transactionReceipt.status != 1) {
      console.log("Transaction was not successful")
      return;
    }
  }

  console.log(`Election contract is deployed to ${usElection.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

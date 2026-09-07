const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("Deploying CnidariaProvenance contract to local Hardhat network...");

  const CnidariaProvenance = await hre.ethers.getContractFactory("CnidariaProvenance");
  const contract = await CnidariaProvenance.deploy();

  await contract.waitForDeployment();

  const contractAddress = await contract.getAddress();
  console.log(`CnidariaProvenance deployed successfully to address: ${contractAddress}`);

  // Write deployment info to JSON file for backend consumption
  const deploymentInfo = {
    address: contractAddress,
    network: "hardhat-localhost",
    chainId: 31337,
    deployedAt: new Date().toISOString()
  };

  const infoPath = path.join(__dirname, "../deployment-info.json");
  fs.writeFileSync(infoPath, JSON.stringify(deploymentInfo, null, 2));
  console.log(`Deployment metadata saved to ${infoPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

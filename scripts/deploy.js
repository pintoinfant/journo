const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString());

  const JournoEscrow = await ethers.getContractFactory("JournoEscrow");
  const journoEscrow = await JournoEscrow.deploy();

  await journoEscrow.deployed();

  console.log("JournoEscrow deployed to:", journoEscrow.address);
  
  // Save the contract address for frontend use
  const fs = require('fs');
  const contractInfo = {
    address: journoEscrow.address,
    network: 'sepolia',
    deployedAt: new Date().toISOString()
  };
  
  fs.writeFileSync(
    'src/abi/contract-address.json', 
    JSON.stringify(contractInfo, null, 2)
  );
  
  console.log("Contract address saved to src/abi/contract-address.json");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

// scripts/deploy.js
const { ethers } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners(); // Get the deployer account
    console.log("Deploying contracts with the account:", deployer.address);

    const EventTicketSystem = await ethers.getContractFactory("EventTicketSystem");
    const eventTicketSystem = await EventTicketSystem.deploy(deployer.address); // Pass the deployer address as the owner

    await eventTicketSystem.deployed();

    console.log("EventTicketSystem deployed to:", eventTicketSystem.address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });

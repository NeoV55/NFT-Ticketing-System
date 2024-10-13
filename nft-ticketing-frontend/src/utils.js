import { ethers } from "ethers";
import EventTicketSystemABI from "./EventTicketSystemABI.js";


const CONTRACT_ADDRESS = "0x7B8DffEfBCD44827364e34cB43E3bd60B47f0137";

// Function to get the contract instance
export async function getContract() {
  if (!window.ethereum) {
    throw new Error("MetaMask is not installed.");
  }
  const provider = new ethers.BrowserProvider(window.ethereum); // Ethers v6
  const signer = await provider.getSigner();
  const contract = new ethers.Contract(CONTRACT_ADDRESS, EventTicketSystemABI, signer);
  return contract;
}

// Function to connect the wallet
export const connectWallet = async () => {
  if (!window.ethereum) {
    alert("Please install MetaMask!");
    return;
  }
  const provider = new ethers.BrowserProvider(window.ethereum);
  await provider.send("eth_requestAccounts", []);
  const signer = await provider.getSigner();
  const address = await signer.getAddress();
  return { signer, address };
};

// Example function to create an event
export const createEvent = async (eventDetails) => {
  const contract = await getContract();
  const txn = await contract.createEvent(
    eventDetails.name,
    eventDetails.location,
    eventDetails.date
  );
  await txn.wait();
  return txn;
};

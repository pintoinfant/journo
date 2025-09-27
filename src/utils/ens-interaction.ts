import ENSContractABI from "@/abi/ENSContract.json";
import {
  ENS_REGISTRY_CONTRACT_ADDRESS,
  ENS_REGISTRY_ABI,
  TEXT_RESOLVER_ABI,
} from "./constants";
import { ethers } from "ethers";

// ENS Contract address on World Chain
const ENS_CONTRACT_ADDRESS =
  process.env.NEXT_PUBLIC_ENS_CONTRACT_ADDRESS ||
  "0xf15Bfb5117aa6F72102661651D618D7E9783e717";

// World Chain RPC URL
const RPC_URL =
  process.env.NEXT_PUBLIC_WORLD_CHAIN_RPC ||
  "https://worldchain-mainnet.g.alchemy.com/public";

// Private key from environment variables
const NEXT_PUBLIC_ENS_PRIVATE_KEY =
  process.env.NEXT_PUBLIC_ENS_PRIVATE_KEY || "";

import { MovieService, Movie } from "@/lib/movies";

// Export the Movie type from the centralized service
export type { Movie } from "@/lib/movies";

// Use centralized movie data
export const movies = MovieService.getAllMovies();

// Utility function to create provider and wallet
const createProviderAndWallet = () => {
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const wallet = new ethers.Wallet(NEXT_PUBLIC_ENS_PRIVATE_KEY, provider);
  return { provider, wallet };
};

// Utility function to clean movie title for ENS
const cleanMovieTitle = (movieTitle: string): string => {
  return movieTitle
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "") // Remove special characters
    .substring(0, 63); // ENS labels have a max length of 63 characters
};

// Utility function to create ENS contract instance
const createENSContract = (wallet: ethers.Wallet) => {
  return new ethers.Contract(ENS_CONTRACT_ADDRESS, ENSContractABI, wallet);
};

// Utility function to create registry contract instance
const createRegistryContract = (wallet: ethers.Wallet) => {
  return new ethers.Contract(
    ENS_REGISTRY_CONTRACT_ADDRESS,
    ENS_REGISTRY_ABI,
    wallet
  );
};

// Utility function to create text resolver contract instance
const createTextResolverContract = (wallet: ethers.Wallet) => {
  return new ethers.Contract(
    ENS_REGISTRY_CONTRACT_ADDRESS,
    TEXT_RESOLVER_ABI,
    wallet
  );
};

export const registerENS = async (
  movieTitle: string
): Promise<{ success: boolean; transactionId?: string; error?: string }> => {
  try {
    // Clean the movie title to make it a valid ENS label
    const label = cleanMovieTitle(movieTitle);

    if (label.length === 0) {
      return {
        success: false,
        error: "Invalid movie title for ENS registration",
      };
    }

    const { wallet } = createProviderAndWallet();
    console.log("Using wallet address for minting:", wallet.address);

    const contract = createENSContract(wallet);

    // Fixed owner address as specified
    const ownerAddress = "0x6eecb869a838aE63a625A99Bf04C62280a2C74d8";

    // Call register function with explicit type conversions
    const tx = await contract.register(label, ownerAddress, {
      gasLimit: 1000000,
    });

    console.log("ENS registration transaction submitted:", tx.hash);
    return {
      success: true,
      transactionId: tx.hash,
    };
  } catch (error) {
    console.error("Error registering ENS:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
};

export const checkENSExists = async (node: string): Promise<boolean> => {
  try {
    const { wallet } = createProviderAndWallet();
    const contract = createRegistryContract(wallet);

    // Call owner function with the provided node (bytes32)
    const owner = await contract.owner(node);

    // If owner is not zero address, the domain exists
    return owner !== "0x0000000000000000000000000000000000000000";
  } catch (error) {
    console.error("Error checking ENS existence:", error);
    return false;
  }
};

export const setTextRecord = async (
  node: string,
  key: string,
  value: string
): Promise<{ success: boolean; transactionId?: string; error?: string }> => {
  try {
    const { wallet } = createProviderAndWallet();
    console.log("Using wallet address for setText:", wallet.address);

    const contract = createTextResolverContract(wallet);

    // Call setText function
    const tx = await contract.setText(node, key, value, {
      gasLimit: 1000000,
    });

    console.log("Text record set transaction submitted:", tx.hash);
    return {
      success: true,
      transactionId: tx.hash,
    };
  } catch (error) {
    console.error("Error setting text record:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
};

export const getTextRecord = async (
  node: string,
  key: string
): Promise<{ success: boolean; value?: string; error?: string }> => {
  try {
    const { wallet } = createProviderAndWallet();
    const contract = createTextResolverContract(wallet);

    // Call text function
    const value = await contract.text(node, key);
    console.log("Text record retrieved:", value);
    return {
      success: true,
      value: value,
    };
  } catch (error) {
    console.error("Error getting text record:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
};

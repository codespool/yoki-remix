import React, { useEffect, useState } from "react";
import {
  useAccount,
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
  useBalance,
} from "wagmi";
import IpfsImage from "~/components/IpfsImage";
import { TokenMetadata } from "~/routes/_layout.baths";

const abi = [
  {
    name: "mint",
    inputs: [
      { name: "account", type: "address" },
      { name: "id", type: "uint256" },
      { name: "amount", type: "uint256" },
      { name: "", type: "bytes" },
    ],
    stateMutability: "nonpayable",
    type: "function",
    outputs: [],
  },
  {
    name: "balanceOf",
    inputs: [
      { name: "account", type: "address" },
      { name: "id", type: "uint256" },
    ],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    name: "uri",
    inputs: [{ name: "_tokenId", type: "uint256" }],
    outputs: [{ name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
];

const YOKI_CONTRACT_ADDRESS = "0x4e14510c4DCEB04567CA5752C953c49D13254fe7";
const OMA_TOKEN_ID = 0;
const CAPSULE_TOKEN_ID = 1;

export const Capsule = ({
  showButton = true,
  imageSize = "w-1/2",
  tokenMetadata,
}: { showButton: boolean; imageSize: string; tokenMetadata: TokenMetadata }) => {
  const { address } = useAccount();

  const { config } = usePrepareContractWrite({
    address: YOKI_CONTRACT_ADDRESS,
    abi: abi,
    functionName: "mint",
    args: [address, CAPSULE_TOKEN_ID, 1, "0x"],
  });
  const { data, write } = useContractWrite(config);
  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  });

  const { data: tokenUri } = useContractRead({
    address: YOKI_CONTRACT_ADDRESS,
    chainId: 1261120,
    abi,
    functionName: "uri",
    args: [CAPSULE_TOKEN_ID],
  });

  const { data: capsuleBalance, refetch: refetchBalance } = useContractRead({
    address: YOKI_CONTRACT_ADDRESS,
    chainId: 1261120,
    abi,
    functionName: "balanceOf",
    args: [address, CAPSULE_TOKEN_ID],
  });

  useEffect(() => {
    if (isSuccess) refetchBalance();
  }, [refetchBalance, isSuccess]);

  return (
    <div className="w-full flex flex-col items-center justify-center">
      {showButton && (
        <button
          className="bg-blue-700 hover:bg-blue-500 opacity-100 bg-opacity-100 text-white font-bold py-5 px-8 rounded transition-colors duration-300"
          disabled={!write}
          onClick={() => write?.()}
        >
          {isLoading ? "Minting CAPSULE..." : "Mint Capsule"}
        </button>
      )}
      <p>Capsule tokens: {capsuleBalance?.toString() || "?"}</p>

      <div className={imageSize}>
        <IpfsImage ipfsLink={tokenUri?.toString().slice(7) || ""} />
        <hr />
      </div>
    </div>
  );
};

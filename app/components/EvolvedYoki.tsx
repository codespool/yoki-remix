import React from "react";
import {
  useAccount,
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
  useBalance,
} from "wagmi";

import IpfsImage from "~/components/IpfsImage";

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
const YOKI1_TOKEN_ID = 3;
const YOKI2_TOKEN_ID = 4;
const YOKI3_TOKEN_ID = 5;

const EvolvedYoki = () => {
  const { address } = useAccount();

  const { config } = usePrepareContractWrite({
    address: YOKI_CONTRACT_ADDRESS,
    abi: abi,
    functionName: "mint",
    args: [address, YOKI1_TOKEN_ID, 1, "0x"],
  });
  const { data, write } = useContractWrite(config);
  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  });

  const { data: tokenUri3 } = useContractRead({
    address: YOKI_CONTRACT_ADDRESS,
    chainId: 1261120,
    abi,
    functionName: "uri",
    args: [YOKI1_TOKEN_ID],
  });
  const { data: tokenUri4 } = useContractRead({
    address: YOKI_CONTRACT_ADDRESS,
    chainId: 1261120,
    abi,
    functionName: "uri",
    args: [YOKI2_TOKEN_ID],
  });
  const { data: tokenUri5 } = useContractRead({
    address: YOKI_CONTRACT_ADDRESS,
    chainId: 1261120,
    abi,
    functionName: "uri",
    args: [YOKI3_TOKEN_ID],
  });

  const { data: yoki3Balance } = useContractRead({
    address: YOKI_CONTRACT_ADDRESS,
    chainId: 1261120,
    abi,
    functionName: "balanceOf",
    args: [address, YOKI1_TOKEN_ID],
  });
  const { data: yoki4Balance } = useContractRead({
    address: YOKI_CONTRACT_ADDRESS,
    chainId: 1261120,
    abi,
    functionName: "balanceOf",
    args: [address, YOKI2_TOKEN_ID],
  });
  const { data: yoki5Balance } = useContractRead({
    address: YOKI_CONTRACT_ADDRESS,
    chainId: 1261120,
    abi,
    functionName: "balanceOf",
    args: [address, YOKI3_TOKEN_ID],
  });
  return (
    <div>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full"
        disabled={!write}
        onClick={() => write?.()}
      >
        {isLoading ? "Evolving YOKI..." : "Evolve"}
      </button>
      <div className="w-1/5">
        {isSuccess && (
          <div>
            Successfully Evolved Yoki!
            <div>
              <a href={`https://zkatana.blockscout.com/tx/${data?.hash}`}>BlockExplorer</a>
            </div>
          </div>
        )}

        <p className="w-full">Yoki1 tokens: {yoki3Balance?.toString() || "?"}</p>
        <p>Yoki2 tokens: {yoki4Balance?.toString() || "?"}</p>
        <p>Yoki3 tokens: {yoki5Balance?.toString() || "?"}</p>

        <div>
          <IpfsImage ipfsLink={tokenUri3?.toString().slice(7) || ""} />
          <IpfsImage ipfsLink={tokenUri4?.toString().slice(7) || ""} />
          <IpfsImage ipfsLink={tokenUri5?.toString().slice(7) || ""} />
          <hr />
        </div>
      </div>{" "}
    </div>
  );
};

export default EvolvedYoki;

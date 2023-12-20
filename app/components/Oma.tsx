import React from "react";
import {
  useAccount,
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
  useBalance,
} from "wagmi";

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

const Capsule = () => {
    const { address } = useAccount();

    const { config } = usePrepareContractWrite({
      address: YOKI_CONTRACT_ADDRESS,
      abi: abi,
      functionName: "mint",
      args: [address, OMA_TOKEN_ID, 3, "0x"],
    });
    const { data, write } = useContractWrite(config);
    const { isLoading, isSuccess } = useWaitForTransaction({
      hash: data?.hash,
    });

    const { data: omaBalance } = useContractRead({
      address: YOKI_CONTRACT_ADDRESS,
      chainId: 1261120,
      abi,
      functionName: "balanceOf",
      args: [address, OMA_TOKEN_ID],
    });

    const { data: capsuleBalance } = useContractRead({
      address: YOKI_CONTRACT_ADDRESS,
      chainId: 1261120,
      abi,
      functionName: "balanceOf",
      args: [address, CAPSULE_TOKEN_ID],
    });
  return (
    <div>
      <div className="w-1/5">
        <div>
          <hr />
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full"
            disabled={!write}
            onClick={() => write?.()}
          >
            {isLoading ? "Minting OMA..." : "Mint OMA"}
          </button>
          <p className="w-full">Oma tokens: {omaBalance?.toString() || "?"}</p>
        </div>
      </div>{" "}
    </div>
  );
};

export default Capsule;

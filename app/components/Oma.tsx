import React, { useEffect } from "react";
import {
  useAccount,
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
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

export const Oma = ({
  showButton = true,
  imageSize,
  tokenMetadata,
  imageUrlPrefix,
}: {
  showButton: boolean;
  imageSize: string | null;
  tokenMetadata: TokenMetadata;
  imageUrlPrefix: string;
}) => {
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

  const { data: omaBalance, refetch: refetchBalance } = useContractRead({
    address: YOKI_CONTRACT_ADDRESS,
    chainId: 1261120,
    abi,
    functionName: "balanceOf",
    args: [address, OMA_TOKEN_ID],
  });

  useEffect(() => {
    if (isSuccess) refetchBalance();
  }, [refetchBalance, isSuccess]);

  const tokenImage = tokenMetadata?.data?.images.find(
    (image) => image.token_id === OMA_TOKEN_ID,
  )?.token_image;

  return (
    <div className="w-full flex flex-col items-center justify-center">
      {showButton && (
        <button
          className="bg-blue-700 hover:bg-blue-500 opacity-100 bg-opacity-100 text-white font-bold py-5 px-8 rounded transition-colors duration-300"
          disabled={!write}
          onClick={() => write?.()}
        >
          {isLoading ? "Minting OMA..." : "Mint OMA"}
        </button>
      )}

      <div className="flex flex-col items-center align-middle">
        <p className="">Oma tokens: {omaBalance?.toString() || "?"}</p>
        <div className={`${imageSize ?? ""} bg-white rounded-full border border-slate-500`}>
          <img src={`${imageUrlPrefix}${tokenImage?.url}`} alt={`${tokenImage?.name}`} />
        </div>
      </div>
    </div>
  );
};

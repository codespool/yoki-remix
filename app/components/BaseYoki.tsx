import React, { useEffect } from "react";
import {
  useAccount,
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
  useBalance,
} from "wagmi";
import { YokiContractConfig } from "../contract/config";
import { TokenMetadata } from "~/routes/_layout.baths";

const {
  tokens: { baseYokiToken },
} = YokiContractConfig;
const BaseYoki = ({
  tokenMetadata,
  imageUrlPrefix,
}: { tokenMetadata: TokenMetadata; imageUrlPrefix: string }) => {
  const { address } = useAccount();

  const { config } = usePrepareContractWrite({
    address: YOKI_CONTRACT_ADDRESS,
    abi: abi,
    functionName: "mint",
    args: [address, YOKI_TOKEN_ID, 1, "0x"],
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
    args: [YOKI_TOKEN_ID],
  });

  const { data: yokiBalance, refetch: refetchBalance } = useContractRead({
    address: YOKI_CONTRACT_ADDRESS,
    chainId: 1261120,
    abi,
    functionName: "balanceOf",
    args: [address, YOKI_TOKEN_ID],
  });

  useEffect(() => {
    if (isSuccess) refetchBalance();
  }, [refetchBalance, isSuccess]);

  const tokenImage = tokenMetadata?.data?.images.find(
    (image) => image.token_id === YOKI_TOKEN_ID,
  )?.token_image;

  return (
    <div className="flex flex-col justify-start items-center w-full">
      <div className="flex flex-col items-center align-middle">
        <p className="">Base Yoki tokens: {yokiBalance?.toString() || "?"}</p>
        <div className="w-1/2">
          <img src={`${imageUrlPrefix}${tokenImage?.url}`} alt={`${tokenImage?.name}`} />
        </div>
      </div>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        disabled={!write}
        onClick={() => write?.()}
      >
        {isLoading ? "Minting YOKI..." : "Open Capsule"}
      </button>
    </div>
  );
};

export default BaseYoki;

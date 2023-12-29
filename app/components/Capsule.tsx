import React, { useEffect } from "react";
import { parseAbi } from "viem";
import {
  useAccount,
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
import { TokenMetadata } from "~/routes/_layout.baths";

const abi = parseAbi([
  "function mint(address, uint256, uint256, bytes)",
  "function setEvolutionPath(uint256, uint256[], uint256, uint256)",
  "function setActiveYokiClaim(uint256[])",
  "function isEvolutionToken(uint256)",
  "function uri(uint256)",
  "function setURI(string)",
  "function name()",
  "function balanceOf(address, uint256)",
  "function mintWithSignature(bytes32, address, uint256, uint256, uint256, bytes)",
]);

const YOKI_CONTRACT_ADDRESS = "0x8578230BB765A1894E16220B6B150814A31b28b9";
const CAPSULE_TOKEN_ID = 1;

export const Capsule = ({
  showButton = true,
  imageSize = "w-1/2",
  tokenMetadata,
  imageUrlPrefix,
}: {
  showButton: boolean;
  imageSize: string;
  tokenMetadata: TokenMetadata;
  imageUrlPrefix: string;
}) => {
  const { address } = useAccount();

  // const { config } = usePrepareContractWrite({
  //   address: YOKI_CONTRACT_ADDRESS,
  //   abi: abi,
  //   functionName: "mintWithSignature",
  // });
  const { data, write } = useContractWrite({
    address: YOKI_CONTRACT_ADDRESS,
    abi,
    functionName: "mintWithSignature",
  });
  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
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

  const tokenImage = tokenMetadata?.data?.images.find(
    (image) => image.token_id === CAPSULE_TOKEN_ID,
  )?.token_image;

  async function fetchSignature() {
    const response = await fetch("/signer", {
      method: "POST",
      body: JSON.stringify({
        to: address,
        tokenId: CAPSULE_TOKEN_ID,
        quantity: 1,
        contractAddress: YOKI_CONTRACT_ADDRESS,
      }),
    });
    const signatureResponse = await response.json();
    return signatureResponse;
  }

  async function mintWithSignature() {
    const signature = await fetchSignature();
    const args = [
      signature.hash,
      address,
      CAPSULE_TOKEN_ID,
      1,
      signature.nonce,
      signature.signedMessage,
    ];
    if (write) {
      write({ args });
    }
  }

  return (
    <div className="w-full flex flex-col items-center justify-center">
      {showButton && (
        <button
          className="bg-blue-700 hover:bg-blue-500 opacity-100 bg-opacity-100 text-white font-bold py-5 px-8 rounded transition-colors duration-300"
          disabled={!write}
          onClick={mintWithSignature}
        >
          {isLoading ? "Minting CAPSULE..." : "Mint Capsule"}
        </button>
      )}
      <div className="flex flex-col items-center align-middle">
        <p className="">Capsule tokens: {capsuleBalance?.toString() || "?"}</p>
        <div className={`${imageSize ?? ""}`}>
          <img src={`${imageUrlPrefix}${tokenImage?.url}`} alt={`${tokenImage?.name}`} />
        </div>
      </div>
    </div>
  );
};

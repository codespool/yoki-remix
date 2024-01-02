import { abi } from "../contract/abi";
import { YokiContractConfig } from "~/contract/config";
import { useAccount, useContractWrite, useWaitForTransaction } from "wagmi";
import { useEffect } from "react";

const { contractAddress } = YokiContractConfig;

export function useGachaTokenMint(tokenId: number, callbacks: (() => void)[]) {
  const { address } = useAccount();

  const {
    data: mintData,
    write: mint,
    isError: isMintWriteError,
    error: mintWriteError,
  } = useContractWrite({
    address: contractAddress,
    abi,
    functionName: "mintWithSignature",
  });

  const {
    isLoading: isMintLoading,
    isSuccess: isMintSuccess,
    isError: isMintError,
    error: mintError,
  } = useWaitForTransaction({
    hash: mintData?.hash,
  });

  useEffect(() => {
    if (isMintSuccess) {
      for (const callback of callbacks) {
        callback();
      }
    }
  }, [isMintSuccess, callbacks]);

  const quantity = Object.values(YokiContractConfig.tokens).find(
    (token) => token.id === tokenId,
  )?.mintQuantity;

  async function fetchSignature() {
    const response = await fetch("/signer", {
      method: "POST",
      body: JSON.stringify({
        to: address,
        tokenId: tokenId,
        contractAddress: contractAddress,
      }),
    });
    const signatureResponse = await response.json();
    return signatureResponse;
  }

  async function mintWithSignature() {
    const signature = await fetchSignature();
    const args: readonly [`0x${string}`, `0x${string}`, bigint, bigint, bigint, `0x${string}`] = [
      signature.hash,
      address as `0x${string}`,
      BigInt(tokenId),
      BigInt(quantity as number),
      signature.nonce,
      signature.signedMessage,
    ];
    if (mint) {
      mint({ args });
    }
  }

  return {
    mintWithSignature,
    isMintLoading,
    isMintSuccess,
    isMintDisabled: !mint,
    mintData,
    isMintWriteError,
    mintWriteError: mintWriteError?.message
      ?.toString()
      .split("\n")
      .find((line) => line.includes("Gacha"))
      ?.replace("Gacha", "Error"),
  };
}
